// src/components/layout/topbar.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/button';
import { searchIndex } from '@/lib/search-index';

// Tipo para los resultados de búsqueda
type SearchResult = {
  path: string;
  title: string;
  description?: string;
  category: string;
  keywords: string;
  icon?: React.ReactNode;
};

// Componente para resaltar el término de búsqueda
const HighlightText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded">{part}</mark> : part
      )}
    </>
  );
};

const Topbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { user, userRole } = useAuth();
  const router = useRouter();

  // Estados para el modal de nueva publicación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as const,
    duration: 7,
    image: null as File | null,
  });
  const [isPublishing, setIsPublishing] = useState(false);

  // Manejar la búsqueda con debounce
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsSearching(true);
    
    // Simular un pequeño retraso para mostrar el indicador de carga
    setTimeout(() => {
      if (term) {
        const filtered = searchIndex.filter(item =>
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.keywords.toLowerCase().includes(term.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(term.toLowerCase()))
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
      setIsSearching(false);
    }, 300);
  }, []);

  // Manejar el cierre de la búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejar atajo de teclado para la búsqueda (Ctrl+K o Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      
      // Navegación con teclado en los resultados
      if (isSearchOpen) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (event.key === 'Enter' && focusedIndex >= 0) {
          event.preventDefault();
          router.push(results[focusedIndex].path);
          setIsSearchOpen(false);
          setSearchTerm('');
        } else if (event.key === 'Escape') {
          setIsSearchOpen(false);
          searchInputRef.current?.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, focusedIndex, results, router]);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    searchInputRef.current?.focus();
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Manejar publicación de nueva post
  const handlePublishPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Por favor, completa el título y contenido');
      return;
    }

    setIsPublishing(true);
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error('No token');

      let imageBase64 = null;
      if (newPost.image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(newPost.image as Blob);
        });
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          duration: newPost.duration,
          image: imageBase64,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewPost({
          title: '',
          content: '',
          category: 'general',
          duration: 7,
          image: null,
        });
        alert('Publicación creada exitosamente');
        // Opcional: recargar la página o actualizar el estado
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al publicar la publicación');
    } finally {
      setIsPublishing(false);
    }
  };

  // Agrupar resultados por categoría
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
    <header className="bg-white shadow-md px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center relative border-b border-gray-200 gap-3 md:gap-0">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <div className="relative flex-1 md:flex-initial md:w-96">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar (Ctrl+K)"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-600"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          {isSearchOpen && (
            <div ref={searchResultsRef} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-5 w-5 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-500">Buscando...</span>
                </div>
              ) : results.length > 0 ? (
                <div>
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {category}
                      </div>
                      {items.map((result, index) => (
                        <Link key={result.path} href={result.path}>
                          <div 
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start space-x-3 transition-colors ${
                              focusedIndex === results.indexOf(result) ? 'bg-blue-50' : ''
                            }`}
                            onMouseEnter={() => setFocusedIndex(results.indexOf(result))}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {result.icon || (
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                <HighlightText text={result.title} highlight={searchTerm} />
                              </p>
                              {result.description && (
                                <p className="text-sm text-gray-500 truncate">
                                  <HighlightText text={result.description} highlight={searchTerm} />
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                  <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
                    {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ) : searchTerm ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <svg className="h-12 w-12 text-gray-300 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No se encontraron resultados para "{searchTerm}"</p>
                  <p className="text-sm mt-1">Intenta con otros términos</p>
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  <p className="font-medium mb-2">Sugerencias de búsqueda:</p>
                  <ul className="space-y-1">
                    <li>• Usa palabras clave específicas</li>
                    <li>• Navega con las flechas ↑↓</li>
                    <li>• Presiona Enter para seleccionar</li>
                    <li>• Presiona Esc para cerrar</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
        {userRole === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 overflow-hidden text-sm md:text-base"
          >
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

            {/* Texto */}
            <span className="relative z-10 tracking-wide">
              <span className="hidden sm:inline">Añadir Publicación</span>
              <span className="sm:hidden">Añadir</span>
            </span>

            {/* Efecto de borde brillante */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm"></div>
          </button>
        )}

        {user && (
          <Link href="/calendar">
            <button
              className="group relative inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 overflow-hidden text-sm md:text-base"
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              {/* Texto */}
              <span className="relative z-10 tracking-wide">
                <span className="hidden sm:inline">Ver Calendario</span>
                <span className="sm:hidden">Calendario</span>
              </span>

              {/* Efecto de borde brillante */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm"></div>
            </button>
          </Link>
        )}

        {user && (
          <>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:block">{user.email}</span>
            </div>
            <Button onClick={handleLogout} variant="secondary" className="text-sm px-3 py-2">
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </Button>
          </>
        )}
      </div>
    </header>

    {/* Modal para nueva publicación */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold mb-4">Nueva Publicación</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                placeholder="Título de la publicación"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-black placeholder-gray-600"
                placeholder="Contenido de la publicación"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="urgente">🔴 Urgente</option>
                <option value="nueva-herramienta">🛠️ Nueva Herramienta</option>
                <option value="reforma">🔄 Reforma</option>
                <option value="mantenimiento">⚙️ Mantenimiento</option>
                <option value="general">📋 General</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <select
                value={newPost.duration}
                onChange={(e) => setNewPost({...newPost, duration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value={1}>1 día</option>
                <option value={3}>3 días</option>
                <option value={7}>1 semana</option>
                <option value={15}>15 días</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPost({...newPost, image: e.target.files?.[0] || null})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              onClick={() => setIsModalOpen(false)} 
              variant="secondary"
              disabled={isPublishing}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePublishPost} 
              variant="primary"
              disabled={isPublishing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPublishing ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Topbar;
