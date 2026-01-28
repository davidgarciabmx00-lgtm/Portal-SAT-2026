// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Eliminando post con ID:', id);

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

    // 4. Eliminar el post de Firestore
    console.log('Eliminando post de Firestore...');
    await db.collection('posts').doc(id).delete();

    console.log('✅ Post eliminado exitosamente');
    return NextResponse.json({ message: 'Post eliminado exitosamente' }, { status: 200 });

  } catch (error) {
    console.error('❌ Error al eliminar el post:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}