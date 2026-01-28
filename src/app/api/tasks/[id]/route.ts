// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const taskRef = db.collection('tasks').doc(id);
    await taskRef.delete();

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const { technicianId, technicianName, startDate, endDate, description, links } = await request.json();

    if (!technicianId || !technicianName || !startDate || !endDate || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const taskRef = db.collection('tasks').doc(id);
    await taskRef.update({
      technicianId,
      technicianName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      links: links || [],
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}