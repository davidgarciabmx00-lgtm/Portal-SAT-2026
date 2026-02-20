// src/components/posts/post-list.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { Post, PostCategory } from '@/types/post';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { firestore } from '@/lib/firebase';

const CATEGORY_STYLES: Record<PostCategory, { label: string; color: string }> = {
  urgente: { label: '🔴 Urgente', color: 'bg-red-100 text-red-800' },
  'nueva-herramienta': { label: '🛠️ Nueva Herramienta', color: 'bg-blue-100 text-blue-800' },
  reforma: { label: '🔄 Reforma', color: 'bg-yellow-100 text-yellow-800' },
  mantenimiento: { label: '⚙️ Mantenimiento', color: 'bg-green-100 text-green-800' },
  general: { label: '📋 General', color: 'bg-gray-100 text-gray-800' },
};

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, userRole } = useAuth();

  const fetchPosts = async () => {
    const now = Timestamp.now();

    try {
      const postsRef = collection(firestore, 'posts');
      // Obtener posts que no han expirado
      const q = query(postsRef, where('expiresAt', '>', now), orderBy('expiresAt', 'desc'));
      const snapshot = await getDocs(q);

      const postsData: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt),
        } as Post);
      });

      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error('No token');

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remover el post de la lista local
        setPosts(posts.filter(post => post.id !== postId));
        alert('Publicación eliminada exitosamente');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la publicación');
    }
  };

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md border relative">
          {userRole === 'admin' && (
            <button
              onClick={() => handleDeletePost(post.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
              title="Eliminar publicación"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 pr-8">{post.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${CATEGORY_STYLES[post.category]?.color || CATEGORY_STYLES.general.color}`}>
              {CATEGORY_STYLES[post.category]?.label || CATEGORY_STYLES.general.label}
            </span>
          </div>
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4" />
          )}
          <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
            <span>Por <strong>{post.author}</strong></span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No hay publicaciones recientes</p>
          <p className="text-sm">Las publicaciones aparecen aquí durante una semana</p>
        </div>
      )}
    </div>
  );
};

export default PostList;