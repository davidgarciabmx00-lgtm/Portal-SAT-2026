// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!auth) {
      return NextResponse.json({
        error: 'Firebase Admin not initialized. Please configure Firebase Admin credentials. For development, download service-account-key.json from Firebase Console and place it in the project root, or set FIREBASE_PROJECT_ID and other environment variables.'
      }, { status: 500 });
    }

    // Obtener todos los usuarios (limitado a 1000 para evitar timeouts)
    const listUsersResult = await auth.listUsers(1000);
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      role: (user.customClaims?.role as string) || 'user',
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!auth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Verificar que el solicitante sea admin
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    const decodedToken = await auth.verifyIdToken(idToken);
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { uid, role } = await request.json();

    // Actualizar el rol del usuario
    await auth.setCustomUserClaims(uid, { role });

    // Forzar refresh del token del usuario afectado
    try {
      await auth.revokeRefreshTokens(uid);
    } catch (error) {
      // Ignorar errores de revoke (usuario podría no tener refresh tokens)
    }

    return NextResponse.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}