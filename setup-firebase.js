#!/usr/bin/env node

// setup-firebase.js - Script para configurar Firebase Admin fácilmente

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando Firebase Admin para el Portal de Soporte SAT...\n');

// Verificar si ya existe service-account-key.json
const serviceAccountPath = path.join(__dirname, 'service-account-key.json');

if (fs.existsSync(serviceAccountPath)) {
  console.log('✅ service-account-key.json encontrado. Firebase Admin debería funcionar.');
  console.log('Si aún tienes problemas, verifica que el archivo sea válido.\n');
  process.exit(0);
}

// Verificar si hay variables de entorno configuradas
const hasEnvVars = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;

if (hasEnvVars) {
  console.log('✅ Variables de entorno de Firebase Admin configuradas.');
  console.log('Firebase Admin debería funcionar.\n');
  process.exit(0);
}

console.log('❌ No se encontró configuración de Firebase Admin.');
console.log('\n📋 Pasos para configurar Firebase Admin:');
console.log('\n1. Ve a Firebase Console: https://console.firebase.google.com/');
console.log('2. Selecciona tu proyecto "soporte-sat"');
console.log('3. Ve a Configuración del proyecto (icono de engranaje)');
console.log('4. Ve a la pestaña "Cuentas de servicio"');
console.log('5. En "SDK de Firebase Admin", haz clic en "Generar nueva clave privada"');
console.log('6. Descarga el archivo JSON');
console.log('7. Coloca el archivo descargado en la raíz del proyecto como "service-account-key.json"');
console.log('\n   O configura estas variables de entorno en .env.local:');
console.log('   - FIREBASE_PROJECT_ID');
console.log('   - FIREBASE_PRIVATE_KEY_ID');
console.log('   - FIREBASE_PRIVATE_KEY');
console.log('   - FIREBASE_CLIENT_EMAIL');
console.log('   - FIREBASE_CLIENT_ID');
console.log('   - FIREBASE_CLIENT_X509_CERT_URL');
console.log('\n8. Ejecuta: node set-admin.js (para asignar rol de admin)');
console.log('\n🔄 Una vez configurado, reinicia el servidor de desarrollo.\n');

process.exit(1);