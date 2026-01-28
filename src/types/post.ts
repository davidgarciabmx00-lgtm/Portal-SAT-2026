// src/types/post.ts
export type PostCategory = 'urgente' | 'nueva-herramienta' | 'reforma' | 'mantenimiento' | 'general';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  category: PostCategory;
  createdAt: Date;
  imageUrl?: string;
  duration: number; // en días
  expiresAt: Date;
}