// src/app/paneles/configuracion-redes/page.tsx
import CodeBlock from '@/components/panels/code-block';
import VideoLink from '@/components/panels/video-link';

export default function ConfiguracionRedes() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Configuración de Redes</h1>
      <p className="text-gray-700">Guía para configurar redes en el sistema SAT.</p>
      <h2 className="text-2xl font-semibold text-black">Conectar via SSH</h2>
      <CodeBlock code="ssh usuario@servidor -p 2222" />
      <h2 className="text-2xl font-semibold text-black">Video Tutorial</h2>
      <VideoLink
        title="Configuración de Redes SAT"
        url="https://sharepoint.com/video"
        duration="15 min"
      />
    </div>
  );
}