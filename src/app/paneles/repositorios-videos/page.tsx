// src/app/paneles/repositorios-videos/page.tsx
import VideoLink from '@/components/panels/video-link';

export default function RepositoriosVideos() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-black">Repositorio de Videos</h1>
        <p className="text-gray-700">Biblioteca completa de videos tutoriales y guías técnicas para el sistema SAT.</p>
      </div>

      {/* Calibración de Termostatos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">🔧 Calibración de Termostatos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VideoLink
            title="Calibración Termostato MH7"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQC8CElSEF-gSb3RE0bgJE4hAXyH_dgEnz58OUtfkpJxURs?e=PLs3Sv&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D"
            duration="15 min"
          />

          <VideoLink
            title="Calibración Termostato MH8"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQAWfxBQyH9iRafidnSys1NgAd9OU0Ka9Lhhir41upRSR28?e=1kriiw&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D"
            duration="18 min"
          />
        </div>
      </section>

      {/* Cerraduras y Accesos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">🔐 Cerraduras y Accesos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VideoLink
            title="Calibrar Danalock"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQBwwuEzvSrHRIF00HRagYIrARL6kRMB-_RcxpNEN7_13b8?e=dOAn3j&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D"
            duration="12 min"
          />

          <VideoLink
            title="Funcionamiento Cerradura Vians"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQAUTW1GsqhvSZ15oK6r7T2lAa46j4X8AsYZk2IwL9s8hnw?e=3sgSOP&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D"
            duration="10 min"
          />
        </div>
      </section>

      {/* Cámaras y Sensores */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">📹 Cámaras y Sensores</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VideoLink
            title="Ver Milesight en Remoto a Través del GW"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQCSUp9tOGzlR4qv77YGJ2GnAfLmLDmnpgYx7TS7xWcgW9M?e=2QtWyF"
            duration="8 min"
          />

          <VideoLink
            title="Configuración del Milesight"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQDqSUCeDsQGTIEmF4m78LwMAe0yKTmqHzFwoSiDG-fZPmw?e=f6tVPl"
            duration="20 min"
          />

          <VideoLink
            title="Configurar Contador Terabee"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQBKhcmNGz2YT7_QnZLuys4oAew138C0B-Fz0V62I0OOy-A?e=fxYtNu"
            duration="15 min"
          />

          <VideoLink
            title="Configurar Videoportería con IP-Config"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQD5i9Lu17dTQYKKfnSR8L8xATOTie9hE2lK4MlUV-bapkU?e=RAguf4"
            duration="18 min"
          />
        </div>
      </section>

      {/* Integraciones */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">🏠 Integraciones</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VideoLink
            title="Configurar HomeKit"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQAIGsEZyQznT7edjvkltYedAQ9NtVXXmrbmT0RhWA9GXFI?e=D6EVnJ"
            duration="14 min"
          />

          <VideoLink
            title="Integrar KNX a GW"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQCeI3WcHk0RSZtbxQXZYH9zAQeHpmuJJag6wCLYiASKjmg?e=c2jttG"
            duration="15 min"
          />

          <VideoLink
            title="DALI y KNX"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQBpZrZ04GwTRIDuL-NuFkcCAZ2vd-KgEUltm_T6RN1hIQg?e=kMamiI"
            duration="12 min"
          />

          <VideoLink
            title="Zonas Comunes GW Amper"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQCD7pqwkJ-FSpZzG_T0XLabAaPJZn--hHQ2Qa77JAcltY0?e=fV6LSx"
            duration="10 min"
          />
        </div>
      </section>

      {/* Herramientas y Configuraciones Avanzadas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">🔧 Herramientas y Configuraciones Avanzadas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VideoLink
            title="Accesos en Remoto por RusDesk"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQADRCac-K4xQ6SO8HzGKTQ7AcKmBBLazH9onQJLix0A0rQ?e=yGoGgg"
            duration="12 min"
          />

          <VideoLink
            title="Configuración de Baudios Uponor"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQANiR6BCD56R4pqU4a3Gaa0AQwE_4CunzZAQnhavrHmwpw?e=scXvf9"
            duration="10 min"
          />

          <VideoLink
            title="Cómo Usar el GW Tools"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQBdqNVtRBzzTZxM3nv5blANAbZ7hXQPly8tNJ-4V5lBW1I?e=639Ndh"
            duration="16 min"
          />

          <VideoLink
            title="Plantillas para Switch Mikrotik"
            url="https://alfredsmart.sharepoint.com/:v:/s/internalsupport/IQDbaYBDOK5XRae0drpGs0uxAWT9bUGGu3hsh-nwwYMtiYI?e=8UbjVP"
            duration="14 min"
          />
        </div>
      </section>

      {/* Información Adicional */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">ℹ️ Información Adicional</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="space-y-3 text-blue-800">
            <p><strong>📂 Ubicación:</strong> Todos los videos están almacenados en SharePoint de Alfred Smart en la carpeta "Internal Support".</p>
            <p><strong>🔒 Acceso:</strong> Los videos requieren credenciales corporativas para acceder al contenido.</p>
            <p><strong>📱 Compatibilidad:</strong> Los videos se pueden ver directamente en el navegador o descargar para visualización offline.</p>
            <p><strong>🆕 Actualizaciones:</strong> Esta biblioteca se actualiza regularmente con nuevos tutoriales y guías técnicas.</p>
            <p><strong>🏷️ Categorización:</strong> Los videos están organizados por tipo de dispositivo y funcionalidad para facilitar la búsqueda.</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">💡 Consejos para Técnicos</h3>
          <ul className="text-green-700 space-y-1">
            <li>• Revisa el video correspondiente antes de realizar cualquier calibración o configuración</li>
            <li>• Los videos incluyen procedimientos paso a paso con explicaciones detalladas</li>
            <li>• Si encuentras algún problema durante la visualización, contacta al equipo de soporte</li>
            <li>• Comparte estos recursos con el equipo técnico para mantener estándares consistentes</li>
          </ul>
        </div>
      </section>
    </div>
  );
}