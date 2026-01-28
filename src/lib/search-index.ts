// src/lib/search-index.ts
export const searchIndex = [
  // Páginas principales
  {
    title: 'Inicio',
    path: '/',
    keywords: 'home inicio principal publicaciones relevantes dashboard',
    description: 'Página principal del portal con publicaciones relevantes',
    category: 'General'
  },
  {
    title: 'Calendario',
    path: '/calendar',
    keywords: 'calendario tareas programadas agenda semanal tecnicos mantenimiento',
    description: 'Calendario semanal con tareas programadas para técnicos',
    category: 'Gestión'
  },
  {
    title: 'Panel de Administración',
    path: '/admin',
    keywords: 'admin administracion usuarios roles tecnicos gestion',
    description: 'Panel de administración para gestionar usuarios y roles',
    category: 'Administración'
  },

  // Paneles Técnicos
  {
    title: 'Comandos Útiles',
    path: '/paneles/comandos-utiles',
    keywords: 'comandos terminal linux bash utilidades tecnico ssh red servidor',
    description: 'Guía de comandos esenciales para técnicos del sistema SAT',
    category: 'Paneles Técnicos'
  },
  {
    title: 'Configuración de Redes',
    path: '/paneles/configuracion-redes',
    keywords: 'red ip ssh servidor configuracion red ethernet wifi',
    description: 'Guías para configuración de redes y conexiones SSH',
    category: 'Paneles Técnicos'
  },
  {
    title: 'Configuración WiFi Gateway Amper',
    path: '/paneles/configuracion-wifi-gw-amper',
    keywords: 'wifi gateway amper nmcli red inalambrica escanear conectar wlan0',
    description: 'Guía completa para configurar y mantener la conexión WiFi en el Gateway Amper',
    category: 'Paneles Técnicos'
  },
  {
    title: 'Repositorio de Videos',
    path: '/paneles/repositorios-videos',
    keywords: 'videos tutoriales guias termostatos calibracion cerraduras camaras sensores',
    description: 'Biblioteca completa de videos tutoriales y guías técnicas para el sistema SAT',
    category: 'Paneles Técnicos'
  },

  // Contenido específico de videos (para búsquedas más específicas)
  {
    title: 'Calibración Termostato MH7',
    path: '/paneles/repositorios-videos',
    keywords: 'termostato mh7 calibracion video tutorial guia',
    description: 'Video tutorial: Calibración del Termostato MH7',
    category: 'Videos'
  },
  {
    title: 'Calibración Termostato MH8',
    path: '/paneles/repositorios-videos',
    keywords: 'termostato mh8 calibracion video tutorial guia',
    description: 'Video tutorial: Calibración del Termostato MH8',
    category: 'Videos'
  },
  {
    title: 'Calibrar Danalock',
    path: '/paneles/repositorios-videos',
    keywords: 'danalock cerradura calibracion video tutorial guia',
    description: 'Video tutorial: Calibración de cerradura Danalock',
    category: 'Videos'
  },
  {
    title: 'Funcionamiento Cerradura Vians',
    path: '/paneles/repositorios-videos',
    keywords: 'vians cerradura funcionamiento video tutorial guia',
    description: 'Video tutorial: Funcionamiento de cerradura Vians',
    category: 'Videos'
  },

  // Términos técnicos comunes
  {
    title: 'SSH',
    path: '/paneles/configuracion-redes',
    keywords: 'ssh secure shell conexion remota servidor terminal',
    description: 'Información sobre conexiones SSH y configuración',
    category: 'Técnico'
  },
  {
    title: 'IP Configuration',
    path: '/paneles/configuracion-redes',
    keywords: 'ip direccion ip configuracion red ethernet',
    description: 'Configuración de direcciones IP y redes',
    category: 'Técnico'
  },
  {
    title: 'WiFi Setup',
    path: '/paneles/configuracion-wifi-gw-amper',
    keywords: 'wifi configuracion red inalambrica nmcli wlan0',
    description: 'Configuración de conexiones WiFi',
    category: 'Técnico'
  },
  {
    title: 'Terminal Commands',
    path: '/paneles/comandos-utiles',
    keywords: 'terminal comandos bash linux utilidades',
    description: 'Comandos útiles para terminal y línea de comandos',
    category: 'Técnico'
  }
];