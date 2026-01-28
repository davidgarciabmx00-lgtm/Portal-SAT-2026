// src/app/paneles/comandos-utiles/page.tsx
import CodeBlock from '@/components/panels/code-block';
import VideoLink from '@/components/panels/video-link';

export default function ComandosUtiles() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-black">Comandos Útiles</h1>
        <p className="text-gray-700">Guía completa de comandos esenciales para técnicos del sistema SAT. Todos los códigos SSH son fácilmente copiables.</p>
      </div>

      {/* Gateways */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">Gateways</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver estado del gateway</h3>
            <CodeBlock code="ssh admin@gateway-ip -p 22" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Reiniciar servicios del gateway</h3>
            <CodeBlock code="sudo systemctl restart sat-gateway" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver logs del gateway</h3>
            <CodeBlock code="tail -f /var/log/sat/gateway.log" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Actualizar firmware del gateway</h3>
            <CodeBlock code="sudo apt update && sudo apt install sat-gateway-firmware" />
          </div>
        </div>
      </section>

      {/* Access */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">Access</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver dispositivos conectados</h3>
            <CodeBlock code="ssh access@access-server -p 22" />
            <CodeBlock code="sat-access list-devices" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Configurar nuevo dispositivo</h3>
            <CodeBlock code="sat-access add-device --mac AA:BB:CC:DD:EE:FF --type rfid" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver logs de acceso</h3>
            <CodeBlock code="tail -f /var/log/sat/access.log" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Reiniciar controlador de acceso</h3>
            <CodeBlock code="sudo systemctl restart sat-access-controller" />
          </div>
        </div>
      </section>

      {/* Networks */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">Networks</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver configuración de red</h3>
            <CodeBlock code="ssh network@network-server -p 22" />
            <CodeBlock code="ip addr show" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver tabla de rutas</h3>
            <CodeBlock code="ip route show" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver conexiones activas</h3>
            <CodeBlock code="netstat -tuln" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Reiniciar servicios de red</h3>
            <CodeBlock code="sudo systemctl restart networking" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver estado de VPN</h3>
            <CodeBlock code="sudo systemctl status openvpn@sat-vpn" />
          </div>
        </div>
      </section>

      {/* OpenHAB */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">OpenHAB</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Acceder a la consola de OpenHAB</h3>
            <CodeBlock code="ssh openhab@openhab-server -p 22" />
            <CodeBlock code="openhab-cli console" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver estado de servicios</h3>
            <CodeBlock code="sudo systemctl status openhab" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Reiniciar OpenHAB</h3>
            <CodeBlock code="sudo systemctl restart openhab" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver logs de OpenHAB</h3>
            <CodeBlock code="tail -f /var/log/openhab/openhab.log" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Limpiar cache de OpenHAB</h3>
            <CodeBlock code="sudo openhab-cli clean-cache" />
          </div>
        </div>
      </section>

      {/* KNX */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">KNX</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver dispositivos KNX conectados</h3>
            <CodeBlock code="ssh knx@knx-gateway -p 22" />
            <CodeBlock code="knxtool busmonitor" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Programar dispositivo KNX</h3>
            <CodeBlock code="knxtool write 1/1/1 1" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver configuración ETS</h3>
            <CodeBlock code="cat /etc/knx/ets.config" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Reiniciar gateway KNX</h3>
            <CodeBlock code="sudo systemctl restart knxd" />
          </div>
        </div>
      </section>

      {/* Bluetooth */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">Bluetooth</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Ver dispositivos Bluetooth emparejados</h3>
            <CodeBlock code="ssh bluetooth@bluetooth-server -p 22" />
            <CodeBlock code="bluetoothctl paired-devices" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Escanear dispositivos Bluetooth</h3>
            <CodeBlock code="bluetoothctl scan on" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Conectar dispositivo Bluetooth</h3>
            <CodeBlock code="bluetoothctl connect AA:BB:CC:DD:EE:FF" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Reiniciar servicio Bluetooth</h3>
            <CodeBlock code="sudo systemctl restart bluetooth" />
          </div>
        </div>
      </section>

      {/* Credenciales */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">Credenciales de Acceso</h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <span className="material-symbols-outlined text-yellow-600 mr-2">warning</span>
            <h3 className="text-lg font-medium text-yellow-800">Importante</h3>
          </div>
          <p className="text-yellow-700 text-sm">
            Las credenciales deben ser manejadas con extrema precaución. No compartir con personal no autorizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-black">Gateway Principal</h3>
            <CodeBlock code="Usuario: admin
Contraseña: Sat2024!
IP: 192.168.1.100
Puerto: 22" />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-black">Servidor OpenHAB</h3>
            <CodeBlock code="Usuario: openhab
Contraseña: openhab2024
IP: 192.168.1.101
Puerto: 22" />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-black">Controlador de Acceso</h3>
            <CodeBlock code="Usuario: access
Contraseña: access2024
IP: 192.168.1.102
Puerto: 22" />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-black">Gateway KNX</h3>
            <CodeBlock code="Usuario: knx
Contraseña: knx2024
IP: 192.168.1.103
Puerto: 22" />
          </div>
        </div>
      </section>

      {/* Notas Adicionales */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">Notas Adicionales</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Comandos de Emergencia</h3>
            <p className="text-blue-700 text-sm mb-3">
              En caso de problemas críticos, usar estos comandos con precaución:
            </p>
            <CodeBlock code="sudo systemctl stop sat-all-services" />
            <CodeBlock code="sudo reboot" />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">Mantenimiento Programado</h3>
            <p className="text-green-700 text-sm mb-3">
              Ejecutar semanalmente para mantener la estabilidad del sistema:
            </p>
            <CodeBlock code="sudo apt update && sudo apt upgrade -y" />
            <CodeBlock code="sudo systemctl restart sat-gateway sat-access openhab knxd" />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-800 mb-2">Documentación Adicional</h3>
            <p className="text-purple-700 text-sm mb-3">
              Para guías detalladas y troubleshooting avanzado:
            </p>
            <VideoLink
              title="Guía Completa de Troubleshooting SAT"
              url="https://portal-sat.com/docs/troubleshooting"
              duration="45 min"
            />
            <VideoLink
              title="Configuración Avanzada de OpenHAB"
              url="https://portal-sat.com/docs/openhab-advanced"
              duration="30 min"
            />
          </div>
        </div>
      </section>
    </div>
  );
}