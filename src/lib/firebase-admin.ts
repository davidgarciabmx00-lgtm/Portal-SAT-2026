// src/lib/firebase-admin.ts - Updated for Vercel deployment
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

if (!admin.apps.length) {
  try {
    console.log('🔧 Inicializando Firebase Admin...');

    // Try to use service account key file first (for local development)
    const keyPath = join(process.cwd(), 'firebase-service-account-key.json');

    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('🔧 Inicializando con variables de entorno...');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://portal-soporte-sat-default-rtdb.firebaseio.com/',
      });
    } else {
      try {
        console.log('🔧 Intentando inicializar con archivo service-account-key.json...');
        const key = JSON.parse(readFileSync(keyPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(key),
          databaseURL: 'https://portal-soporte-sat-default-rtdb.firebaseio.com/',
        });
        console.log('✅ Firebase Admin inicializado con archivo de clave de servicio');
      } catch (fileError) {
        throw new Error('Firebase Admin credentials not found. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables, or place service-account-key.json in the project root.');
      }
    }

    console.log('✅ Firebase Admin inicializado correctamente');
    console.log('Apps length:', admin.apps.length);
  } catch (error) {
    console.error('❌ Error al inicializar Firebase Admin:', error);
    throw error;
  }
}

console.log('📊 Firebase Admin apps:', admin.apps.length);
console.log('📊 App config:', admin.apps[0]?.options);

export const auth = admin.auth();
export const db = admin.firestore();

console.log('✅ Auth y Firestore exportados correctamente');