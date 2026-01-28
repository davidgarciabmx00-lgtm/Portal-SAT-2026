# Portal de Soporte SAT

Un portal interno de soporte técnico construido con Next.js, Firebase y Tailwind CSS.

## 🚀 Características

- **Autenticación con Firebase**: Login seguro con email/contraseña
- **Control de Acceso Basado en Roles (RBAC)**: Diferenciación entre administradores y usuarios estándar usando Firebase Custom Claims
- **Sistema de Posts**: Publicaciones temporales (última semana) para comunicaciones importantes
- **Categorías de Posts**: Sistema de etiquetas para organizar las publicaciones
- **Paneles Técnicos**: Documentación organizada con código SSH y enlaces a SharePoint
- **Panel de Administración**: Gestión de usuarios y roles (solo para admins)
- **Búsqueda**: Funcionalidad de búsqueda para encontrar paneles rápidamente
- **Interfaz Moderna**: Diseño responsivo con Tailwind CSS y animaciones

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Firebase (Auth, Firestore, Admin SDK)
- **Estilos**: Tailwind CSS 4
- **Despliegue**: Vercel
- **Autenticación**: Firebase Auth con Custom Claims

## 📦 Instalación y Configuración

### 1. Clona y configura el proyecto

```bash
git clone <url-del-repositorio>
cd portal-soporte-sat
npm install
```

### 2. Configura Firebase

#### a. Crea un proyecto en Firebase Console
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Crea un nuevo proyecto
- Habilita Authentication con Email/Password
- Crea una base de datos Firestore

#### b. Configura las variables de entorno
Crea un archivo `.env.local`:

```env
# Firebase Client Config (desde Firebase Console > Configuración del proyecto)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin SDK (para APIs server-side)
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_PRIVATE_KEY_ID=tu_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu_proyecto.iam.gserviceaccount.com
```

#### c. Descarga la Service Account Key
- Ve a Firebase Console > Configuración del proyecto > Cuentas de servicio
- Genera nueva clave privada
- Descarga el archivo JSON y colócalo como `service-account-key.json` en la raíz del proyecto
- **Añade este archivo a `.gitignore`**

### 3. Configura los roles de usuario

```bash
# Asigna rol de administrador al usuario admin@alfredsmart.com
node set-admin.js
```

### 4. Ejecuta el proyecto localmente

```bash
npm run dev
```

## 🚀 Despliegue en Vercel

### 1. Configuración de Variables de Entorno en Vercel

Ve al dashboard de Vercel y configura las siguientes variables de entorno en **Project Settings > Environment Variables**:

#### Variables Públicas (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

#### Variables del Servidor (Firebase Admin)
```
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key_aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com/
```

### 2. Despliegue Automático

1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente la configuración de Next.js
3. El build debería completarse exitosamente con las variables de entorno configuradas

### 3. Solución de Problemas Comunes

- **Error de Firebase Admin**: Asegúrate de que todas las variables `FIREBASE_*` estén configuradas correctamente
- **Error de Build**: Verifica que el archivo `service-account-key.json` esté en `.gitignore` (no debe subirse a GitHub)
- **Error de Runtime**: Revisa los logs de Vercel para errores específicos de Firebase

### 4. Verificación del Despliegue

Después del despliegue, verifica que:
- La autenticación funciona correctamente
- Las APIs responden correctamente
- El calendario carga las tareas
- Los administradores pueden gestionar usuarios

Abre [http://localhost:3000](http://localhost:3000) - serás redirigido automáticamente al login.

## 🚀 Despliegue en Vercel

### 1. Prepara el proyecto para producción

```bash
# Asegúrate de que todo compile correctamente
npm run build
```

### 2. Conecta con Vercel

```bash
# Instala Vercel CLI (opcional)
npm i -g vercel

# Despliega
vercel
```

### 3. Configura las variables de entorno en Vercel

En el dashboard de Vercel, ve a tu proyecto > Settings > Environment Variables y añade:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin (para las APIs)
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_PRIVATE_KEY_ID=tu_private_key_id
FIREBASE_PRIVATE_KEY=tu_private_key
FIREBASE_CLIENT_EMAIL=tu_client_email
FIREBASE_CLIENT_ID=tu_client_id
FIREBASE_CLIENT_X509_CERT_URL=tu_cert_url
```

### 4. Despliega

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

Vercel desplegará automáticamente. Tu sitio estará disponible en `tu-proyecto.vercel.app`.

## 🧪 Pruebas de Aceptación

### Flujo de Prueba Completo

1. **Accede al sitio** (en incógnito): Serás redirigido al login
2. **Login como admin** (`admin@alfredsmart.com`): Deberías ver el formulario para crear posts
3. **Crea un post**: Verifica que aparezca inmediatamente en la lista
4. **Logout y login como usuario** (`portalsat@alfredsmart.com`): No deberías ver el formulario de creación
5. **Verifica categorías**: Los posts deberían mostrar sus etiquetas
6. **Panel de administración** (solo para admin): Accede a `/admin` para gestionar usuarios

## 📁 Estructura del Proyecto

```
portal-soporte-sat/
├── 📁 public/
│   └── 📁 images/
│       ├── 📁 logos/ (logo.png, cropped-favicon.png)
│       ├── 📁 screenshots/
│       └── 📁 tutorials/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx (Layout raíz con AuthProvider)
│   │   ├── 📄 page.tsx (Dashboard principal)
│   │   ├── 📁 (auth)/
│   │   │   └── 📁 login/ (Página de login)
│   │   ├── 📁 admin/ (Panel de administración)
│   │   ├── 📁 api/posts/ (API para crear posts)
│   │   └── 📁 paneles/ (Paneles técnicos)
│   ├── 📁 components/
│   │   ├── 📁 ui/ (Componentes básicos)
│   │   ├── 📁 layout/ (Sidebar, Topbar, etc.)
│   │   ├── 📁 posts/ (Sistema de posts)
│   │   └── 📁 panels/ (Componentes para paneles)
│   ├── 📁 contexts/
│   │   └── 📄 AuthContext.tsx (Contexto de autenticación)
│   ├── 📁 lib/
│   │   ├── 📄 firebase.ts (Config Firebase client)
│   │   ├── 📄 search-index.ts (Índice de búsqueda)
│   │   └── 📄 utils.ts (Utilidades)
│   └── 📁 types/
│       ├── 📄 auth.ts (Tipos de auth)
│       └── 📄 post.ts (Tipos de posts)
├── 📄 middleware.ts (Protección de rutas)
├── 📄 set-admin.js (Script para asignar roles)
└── 📄 package.json
```

## 🔐 Usuarios de Prueba

- **Administrador**: `admin@alfredsmart.com` (puede crear posts, acceder al panel admin)
- **Usuario Estándar**: `portalsat@alfredsmart.com` (solo puede ver posts)

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación y Autorización
- Login seguro con Firebase Auth
- Custom Claims para roles (admin/user)
- Middleware que protege rutas
- Persistencia de sesión con cookies

### ✅ Sistema de Posts con Categorías
- Creación de posts (solo admins)
- **Categorías organizativas**: Urgente 🔴, Nueva Herramienta 🛠️, Reforma 🔄, Mantenimiento ⚙️, General 📋
- Visualización con etiquetas de colores
- Filtro de fecha (última semana)
- API protegida server-side

### ✅ Paneles Técnicos
- Panel de "Configuración de Redes" como ejemplo
- Componentes reutilizables para código y enlaces
- Estructura escalable para añadir más paneles

### ✅ Panel de Administración
- **Lista completa de usuarios** registrados en Firebase
- **Gestión de roles en tiempo real**: Promover/degradar usuarios
- **Información detallada**: email, rol, último acceso, fecha de creación
- **Solo accesible para administradores**
- API segura con verificación server-side
- Interfaz intuitiva con tabla responsive

### ✅ Búsqueda y Navegación
- Búsqueda en tiempo real de paneles
- Sidebar colapsable
- Navegación intuitiva

## 🔄 Mejoras Recientemente Implementadas

### 🏷️ Sistema de Categorías para Posts
- **5 categorías principales**: Urgente, Nueva Herramienta, Reforma, Mantenimiento, General
- **Etiquetas visuales** con colores distintivos e iconos
- **Interfaz mejorada** en el formulario de creación
- **Visualización organizada** en la lista de posts

### 👥 Panel de Administración Completo
- **Gestión de usuarios** desde la interfaz web
- **Cambio de roles** sin necesidad de scripts
- **Vista detallada** de información de usuarios
- **Seguridad reforzada** con verificación server-side

### 🎨 Mejoras de UI/UX
- **Sidebar mejorado** con iconos y separación visual
- **Posts con mejor diseño** y información clara
- **Estados de carga** apropiados
- **Navegación intuitiva** al panel admin

## 🚀 Próximas Mejoras Sugeridas

- **Notificaciones en tiempo real** con Firebase Cloud Messaging
- **Sistema de comentarios** en posts
- **Historial de versiones** para paneles técnicos
- **Dashboard con métricas** de uso
- **API REST completa** para integraciones externas

## 📞 Soporte

Para soporte técnico o preguntas sobre el despliegue, revisa:
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)

---

**Estado del Proyecto**: ✅ **Listo para Producción con Funcionalidades Avanzadas**
**Última Actualización**: Enero 2026
**Nuevas Funcionalidades**: Sistema de Categorías y Panel de Administración Completo

## 🔐 Configuración de Roles (RBAC)

### Paso 1: Configurar Firebase Admin

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto → Configuración del proyecto → Cuentas de servicio
3. Haz clic en "Generar nueva clave privada"
4. Descarga el archivo JSON y colócalo en la raíz del proyecto como `service-account-key.json`
5. **Importante**: Añade `service-account-key.json` a tu `.gitignore`

### Paso 2: Asignar Rol de Administrador

Ejecuta el script para asignar el rol de admin al usuario correspondiente:

```bash
node set-admin.js
```

Esto asignará el rol 'admin' al usuario `admin@alfredsmart.com`.

### Paso 3: Usuarios

- **Admin**: `admin@alfredsmart.com` - Puede crear posts y acceder a todas las funciones
- **Usuario estándar**: `portalsat@alfredsmart.com` - Solo puede ver posts y paneles

## 🚀 Ejecutar el Proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/posts/          # API para crear posts (protegida)
│   ├── (auth)/login/       # Página de login
│   ├── paneles/            # Paneles técnicos
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de inicio
├── components/
│   ├── ui/                 # Componentes básicos
│   ├── layout/             # Sidebar, Topbar, etc.
│   ├── posts/              # Componentes de posts
│   └── panels/             # Componentes de paneles
├── contexts/
│   └── AuthContext.tsx     # Contexto de autenticación y roles
├── lib/
│   ├── firebase.ts         # Configuración cliente Firebase
│   ├── search-index.ts     # Índice de búsqueda
│   └── utils.ts            # Utilidades
└── types/
    ├── auth.ts             # Tipos de autenticación
    └── post.ts             # Tipos de posts
```

## 🔒 Seguridad

- **Verificación de roles**: Los posts solo pueden ser creados por administradores
- **Protección de rutas**: Middleware que redirige usuarios no autenticados
- **Validación server-side**: La API verifica el rol antes de crear posts
- **Custom Claims**: Los roles se almacenan de forma segura en los tokens JWT

## 🚀 Despliegue en Vercel

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en Vercel
3. Despliega automáticamente

## 📝 Próximos Pasos

- [ ] Añadir más paneles técnicos
- [ ] Implementar notificaciones
- [ ] Sistema de comentarios en posts
- [ ] Dashboard administrativo
- [ ] Exportación de datos

---
Juan David Ramirez
Desarrollado con ❤️ para el equipo de soporte SAT.
