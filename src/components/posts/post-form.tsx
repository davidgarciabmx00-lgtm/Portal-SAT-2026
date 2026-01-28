// src/components/posts/post-form.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { PostCategory } from '@/types/post';

const CATEGORIES: { value: PostCategory; label: string; color: string }[] = [
  { value: 'urgente', label: '🔴 Urgente', color: 'bg-red-100 text-red-800' },
  { value: 'nueva-herramienta', label: '🛠️ Nueva Herramienta', color: 'bg-blue-100 text-blue-800' },
  { value: 'reforma', label: '🔄 Reforma', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'mantenimiento', label: '⚙️ Mantenimiento', color: 'bg-green-100 text-green-800' },
  { value: 'general', label: '📋 General', color: 'bg-gray-100 text-gray-800' },
];

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const idToken = await user.getIdToken();

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, content, category }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Algo salió mal');
      }

      setTitle('');
      setContent('');
      setCategory('general');
      alert('¡Publicación creada con éxito!');
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Título de la publicación"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as PostCategory)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        required
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Contenido de la publicación"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
        rows={4}
        required
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Publicando...' : 'Publicar'}
      </Button>
    </form>
  );
}