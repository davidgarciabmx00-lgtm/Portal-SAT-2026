// src/components/layout/sidebar.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const { user, userRole, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estados para controlar el comportamiento
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Determinar si el sidebar está expandido
  const isExpanded = useMemo(() => {
    if (isMobile) return isMobileMenuOpen;
    if (isTablet) return true; // Siempre expandido en tablet
    return isHovered;
  }, [isHovered, isMobile, isMobileMenuOpen, isTablet]);

  // Detectar tipo de dispositivo
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);

      if (width >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, isMobile]);

  // Manejo de hover con debounce para mejor experiencia
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // Pequeño retraso para evitar cierres accidentales
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/login');
  }, [logout, router]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Memoizar elementos del menú
  const menuItems = useMemo(() => {
    const items = [
      {
        path: '/',
        label: 'Inicio',
        icon: 'dashboard',
        description: 'Vista general y estadísticas del portal',
      },
      {
        path: '/paneles/comandos-utiles',
        label: 'Comandos Útiles',
        icon: 'terminal',
        description: 'Guía de comandos esenciales para técnicos',
      },
      {
        path: '/paneles/configuracion-redes',
        label: 'Configuración de Redes',
        icon: 'router',
        description: 'Herramientas de configuración de red',
      },
      {
        path: '/paneles/configuracion-wifi-gw-amper',
        label: 'WiFi Gateway Amper',
        icon: 'wifi',
        description: 'Configuración WiFi y watchdog para Gateway Amper',
      },
      {
        path: '/paneles/repositorios-videos',
        label: 'Repositorio de Videos',
        icon: 'video_library',
        description: 'Biblioteca de videos tutoriales y guías técnicas',
      },
    ];

    if (userRole === 'admin') {
      items.push({
        path: '/admin',
        label: 'Panel Administrativo',
        icon: 'admin_panel_settings',
        description: 'Gestión completa de usuarios y sistema',
      });
    }

    return items;
  }, [userRole]);

  // Memoizar función de verificación de ruta activa
  const isActive = useCallback(
    (path: string) => pathname === path,
    [pathname]
  );

  // Renderizado mejorado de elementos del menú
  const renderMenuItem = useCallback(
    (item: typeof menuItems[0]) => {
      const isItemActive = isActive(item.path);

      return (
        <div key={item.path} className="relative group">
          {/* Indicador de página activa - barra lateral izquierda */}
          {isItemActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full" />
          )}

          <Link href={item.path}>
            <div className={`group w-full flex items-center px-5 py-4 rounded-xl transition-all duration-300 ease-out min-h-[70px] focus:ring-2 focus:ring-indigo-500/50 relative ${
              isItemActive
                ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/20 text-white shadow-lg border-l-4 border-indigo-400'
                : 'text-gray-400 hover:bg-gray-800/40 hover:scale-[1.02] hover:shadow-md hover:text-white'
            }`}>
              {/* Contenido expandido - solo visible cuando expandido */}
              <div
                className={`flex-1 text-left transition-opacity duration-300 overflow-hidden ${
                  isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                }`}
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className={`text-base font-semibold truncate leading-tight ${
                    isItemActive ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  <span className={`text-sm leading-tight truncate max-w-full ${
                    isItemActive ? 'text-indigo-200 font-medium' : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {item.description}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Tooltip cuando está colapsado y no es móvil */}
          {!isExpanded && !isMobile && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-4 py-3 bg-gray-900/95 backdrop-blur-md border border-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl max-w-xs">
              <div className="font-semibold text-base leading-tight mb-1">{item.label}</div>
              <div className="text-xs text-gray-300 leading-tight">{item.description}</div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      );
    },
    [isActive, isExpanded, isMobile]
  );

  const getUserDisplayName = () => user?.email || 'Usuario';

  // Versión para móvil
  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-3 bg-gray-900/90 backdrop-blur-md rounded-xl shadow-lg text-white hover:bg-gray-800 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Overlay para cerrar el menú al hacer clic fuera */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Panel lateral móvil */}
        <aside
          className={`fixed left-0 top-0 h-full w-80 bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/40 flex flex-col z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-800/40 flex-shrink-0 min-h-[80px] flex items-center bg-gradient-to-r from-gray-950/80 to-gray-900/60">
            <div className="flex items-center flex-1">
              {/* Logo */}
              <div className="bg-gray-100 size-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 flex-shrink-0 overflow-hidden border border-gray-300">
                <img
                  src="/images/logos/logo.png"
                  alt="SAT Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Texto */}
              <div className="ml-4">
                <h1 className="text-xl font-bold tracking-tight text-white truncate">
                  Portal de Soporte
                </h1>
                <p className="text-sm text-gray-400 truncate font-medium">
                  SAT - Sistema de Apoyo Técnico
                </p>
              </div>
            </div>
          </div>

          {/* Sección de aplicaciones con estilo consistente */}
          <div className="px-5 py-3 border-b border-gray-800 border-opacity-30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-400 text-xl">
                apps
              </span>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-indigo-400 truncate">Aplicaciones</h2>
                <p className="text-xs text-gray-500 truncate">Herramientas disponibles</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>

          {/* Footer fijo con información completa */}
          <div className="p-5 border-t border-gray-800/40 flex-shrink-0 min-h-[80px] flex items-center bg-gradient-to-r from-gray-950/80 to-gray-900/60">
            <div className="flex items-center gap-4 w-full">
              {/* Avatar */}
              <div className="size-11 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="material-symbols-outlined text-white text-lg">
                  person
                </span>
              </div>

              {/* Info de usuario */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-400 truncate">{userRole === 'admin' ? 'Administrador' : 'Usuario'}</p>
              </div>

              {/* Botón logout */}
              <button
                onClick={handleLogout}
                className="material-symbols-outlined text-gray-400 hover:text-red-400 focus:ring-2 focus:ring-red-500/50 transition-colors duration-200 flex-shrink-0 p-2 rounded-lg hover:bg-red-900/20"
                title="Cerrar sesión"
                aria-label="Logout"
              >
                logout
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Versión para escritorio y tablet - Navigation Rail mejorado
  return (
    <aside
      ref={sidebarRef}
      className={`bg-gray-950/90 backdrop-blur-xl border-r border-gray-800/40 flex flex-col h-full sticky top-0 z-10 transition-all duration-400 ease-out rounded-r-3xl overflow-hidden shadow-2xl ${
        isExpanded ? 'w-80' : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header sin toggle */}
      <div className="p-5 border-b border-gray-800/40 flex-shrink-0 min-h-[80px] flex items-center bg-gradient-to-r from-gray-950/80 to-gray-900/60">
        <div className="flex items-center flex-1">
          {/* Logo */}
          <div className="bg-gray-100 size-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 flex-shrink-0 overflow-hidden border border-gray-300">
            <img
              src="/images/logos/logo.png"
              alt="SAT Logo"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Texto - solo visible cuando expandido */}
          <div
            className={`ml-4 transition-opacity duration-300 overflow-hidden ${
              isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
            }`}
          >
            <h1 className="text-xl font-bold tracking-tight text-white truncate">
              Portal de Soporte
            </h1>
            <p className="text-sm text-gray-400 truncate font-medium">
              SAT - Sistema de Apoyo Técnico
            </p>
          </div>
        </div>
      </div>

      {/* Sección de aplicaciones con estilo consistente */}
      <div className="px-5 py-3 border-b border-gray-800 border-opacity-30">
        <div className={`flex items-center gap-3 ${isExpanded ? '' : 'justify-center'}`}>
          <span className="material-symbols-outlined text-indigo-400 text-xl">
            apps
          </span>
          <div className={`flex flex-col transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            <h2 className="text-sm font-semibold text-indigo-400 truncate">Aplicaciones</h2>
            <p className="text-xs text-gray-500 truncate">Herramientas disponibles</p>
          </div>
        </div>
      </div>

      {/* Navigation con espaciado uniforme y margen izquierdo para la barra activa */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3 ml-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Footer simplificado - solo ícono de usuario cuando está colapsado */}
      <div className="p-5 border-t border-gray-800/40 flex-shrink-0 min-h-[80px] flex items-center bg-gradient-to-r from-gray-950/80 to-gray-900/60">
        {isExpanded ? (
          // Versión expandida con información completa
          <div className="flex items-center gap-4 w-full">
            {/* Avatar */}
            <div className="size-11 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="material-symbols-outlined text-white text-lg">
                person
              </span>
            </div>

            {/* Info de usuario */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userRole === 'admin' ? 'Administrador' : 'Usuario'}
              </p>
            </div>

            {/* Botón logout */}
            <button
              onClick={handleLogout}
              className="material-symbols-outlined text-gray-400 hover:text-red-400 focus:ring-2 focus:ring-red-500/50 transition-colors duration-200 flex-shrink-0 p-2 rounded-lg hover:bg-red-900/20"
              title="Cerrar sesión"
              aria-label="Logout"
            >
              logout
            </button>
          </div>
        ) : (
          // Versión colapsada - solo ícono de usuario
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center group"
            title={`${getUserDisplayName()} - Cerrar sesión`}
            aria-label="User menu"
          >
            <div className="size-11 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-md group-hover:from-red-600 group-hover:to-red-800 transition-all duration-200">
              <span className="material-symbols-outlined text-white text-lg group-hover:scale-110 transition-transform duration-200">
                person
              </span>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;