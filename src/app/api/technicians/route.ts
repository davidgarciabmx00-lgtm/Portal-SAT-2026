// src/app/api/technicians/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const techniciansRef = db.collection('technicians');
    const snapshot = await techniciansRef.get();

    const technicians = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(technicians);
  } catch (error) {
    console.error('Error al obtener técnicos:', error);
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

    const { name, city } = await request.json();

    if (!name || !city) {
      return NextResponse.json({ error: 'Name and city are required' }, { status: 400 });
    }

    const techniciansRef = db.collection('technicians');
    const docRef = await techniciansRef.add({
      name,
      city,
      isActive: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Technician created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error al crear técnico:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}