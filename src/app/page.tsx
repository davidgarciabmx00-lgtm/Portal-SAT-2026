// src/app/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import PostList from '@/components/posts/post-list';

export default function Home() {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Publicaciones Relevantes</h1>

      <PostList />
    </div>
  );
}
