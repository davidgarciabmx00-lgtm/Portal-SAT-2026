// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando creación de post...');

    // 1. Obtener el token de autorización del header
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    // 2. Verificar el token y obtener los claims
    const decodedToken = await auth.verifyIdToken(idToken);
    const role = decodedToken.role;

    // 3. Comprobar si el usuario es admin
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    // 4. Obtener los datos del cuerpo de la solicitud
    const { title, content, category, image, duration } = await request.json();

    // 5. Calcular expiresAt
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    // 6. Guardar en Firestore
    console.log('Guardando en Firestore...');
    await db.collection('posts').add({
      title,
      content,
      category,
      author: decodedToken.email,
      authorEmail: decodedToken.email,
      createdAt: Timestamp.now(),
      imageUrl: null, // Por ahora sin imagen
      duration,
      expiresAt: Timestamp.fromDate(expiresAt),
    });

    console.log('✅ Post guardado exitosamente');
    return NextResponse.json({ message: 'Post creado exitosamente' }, { status: 201 });

  } catch (error) {
    console.error('❌ Error al crear el post:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}