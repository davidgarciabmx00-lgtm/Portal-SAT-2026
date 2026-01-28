// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { startOfWeek, endOfWeek } from 'date-fns';

interface Task {
  id: string;
  technicianName: string;
  startDate: any; // Can be Firestore Timestamp, Date, or serialized timestamp
  endDate: any; // Can be Firestore Timestamp, Date, or serialized timestamp
  description: string;
  links: string[];
  address?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const technicianId = searchParams.get('technicianId');
    const weekStart = searchParams.get('weekStart');

    if (!weekStart) {
      return NextResponse.json({ error: 'weekStart parameter is required' }, { status: 400 });
    }

    const startDate = startOfWeek(new Date(weekStart), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(weekStart), { weekStartsOn: 1 });

    const tasksRef = db.collection('tasks');
    let tasks: Task[] = [];

    if (technicianId) {
      // Cuando hay filtro por técnico, hacer consulta simple primero por técnico
      // y luego filtrar por fecha en el cliente
      const technicianQuery = tasksRef.where('technicianId', '==', technicianId);
      const technicianSnapshot = await technicianQuery.get();

      // Filtrar por fecha en JavaScript
      tasks = technicianSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task))
        .filter(task => {
          const taskStart = task.startDate.toDate ? task.startDate.toDate() : new Date(task.startDate);
          return taskStart >= new Date(startDate) && taskStart <= new Date(endDate);
        });
    } else {
      // Si no hay filtro, obtener todas las tareas de la semana
      const query = tasksRef
        .where('startDate', '>=', new Date(startDate))
        .where('startDate', '<=', new Date(endDate));

      const snapshot = await query.get();
      tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { technicianId, technicianName, startDate, endDate, description, address, links } = await request.json();

    if (!technicianId || !technicianName || !startDate || !endDate || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const tasksRef = db.collection('tasks');
    const docRef = await tasksRef.add({
      technicianId,
      technicianName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      address: address || '',
      links: links || [],
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Task created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}