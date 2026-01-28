// src/app/api/technicians/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Technician ID is required' }, { status: 400 });
    }

    const technicianRef = db.collection('technicians').doc(id);
    const technicianDoc = await technicianRef.get();

    if (!technicianDoc.exists) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }
    // Eliminar el técnico
    await technicianRef.delete();

    return NextResponse.json({ message: 'Technician deleted successfully' });
  } catch (error) {
    console.error('Error deleting technician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}