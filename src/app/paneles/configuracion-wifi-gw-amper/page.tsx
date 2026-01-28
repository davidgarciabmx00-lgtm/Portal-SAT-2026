// src/app/paneles/configuracion-wifi-gw-amper/page.tsx
import CodeBlock from '@/components/panels/code-block';

export default function ConfiguracionWifiGwAmper() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-black">Panel de Configuración WiFi para Gateway Amper</h1>
        <p className="text-gray-700">Guía completa para configurar y mantener la conexión WiFi en el Gateway Amper del sistema SAT.</p>
      </div>

      {/* Configuración Básica de WiFi */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">🔧 Configuración Básica de WiFi</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Escanear redes disponibles</h3>
            <CodeBlock code="# Escanear todas las redes WiFi disponibles
nmcli device wifi list" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Conectar a una red WiFi</h3>
            <CodeBlock code={`# Conectar a una red específica con contraseña
sudo nmcli device wifi connect "AlfredSmart" password "AlfredSmart2025" ifname wlan0

# Para redes sin contraseña
sudo nmcli device wifi connect "NombreRed" ifname wlan0`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Verificar conexión actual</h3>
            <CodeBlock code={`# Ver detalles de la conexión WiFi activa
nmcli connection show "AlfredSmart"

# Ver todas las conexiones configuradas
nmcli connection show

# Ver estado de la interfaz WiFi
ip addr show wlan0`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Eliminar configuraciones WiFi</h3>
            <CodeBlock code={`# Listar configuraciones activas
nmcli connection show

# Eliminar una configuración específica
sudo nmcli connection delete "NombreConexion"`} />
          </div>
        </div>
      </section>

      {/* Configuración Avanzada de WiFi */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">⚙️ Configuración Avanzada de WiFi</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Autoconexión</h3>
            <CodeBlock code={`# Habilitar autoconexión al iniciar
sudo nmcli connection modify "AlfredSmart" connection.autoconnect yes`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Prioridad de red</h3>
            <CodeBlock code={`# Establecer prioridad (mayor número = mayor prioridad)
sudo nmcli connection modify "AlfredSmart" connection.autoconnect-priority 10`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Configuración de reconexión</h3>
            <CodeBlock code={`# Reintentos ilimitados si se pierde la conexión
sudo nmcli connection modify "AlfredSmart" connection.autoconnect-retries -1

# Espera 30 segundos entre cada intento de reconexión
sudo nmcli connection modify "AlfredSmart" connection.autoconnect-interval 30`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Configuración de IP estática (opcional)</h3>
            <CodeBlock code={`# Cambiar a IP estática
sudo nmcli connection modify "AlfredSmart" ipv4.method manual
sudo nmcli connection modify "AlfredSmart" ipv4.addresses 192.168.1.100/24
sudo nmcli connection modify "AlfredSmart" ipv4.gateway 192.168.1.1
sudo nmcli connection modify "AlfredSmart" ipv4.dns "8.8.8.8 8.8.4.4"

# Aplicar cambios
sudo nmcli connection down "AlfredSmart" && sudo nmcli connection up "AlfredSmart"`} />
          </div>
        </div>
      </section>

      {/* Implementación de Watchdog para WiFi */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">🐕 Implementación de Watchdog para WiFi</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Paso 1: Crear el script del watchdog</h3>
            <CodeBlock code="# Crear el archivo del script
sudo nano /usr/local/bin/wifi-watchdog.sh" />
            <p className="text-sm text-gray-600 mb-2">Contenido del script:</p>
            <CodeBlock code={`#!/bin/bash
# Nombre de la conexión WiFi
WIFI_CONN="AlfredSmart"
# Revisa si wlan0 está conectada
if ! nmcli -t -f DEVICE,STATE dev | grep -q "wlan0:connected"; then
    echo "$(date) - WiFi desconectado. Intentando reconectar..." >> /var/log/wifi-watchdog.log
    nmcli con up "$WIFI_CONN"
else
    echo "$(date) - WiFi conectado." >> /var/log/wifi-watchdog.log
fi`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Paso 2: Dar permisos de ejecución</h3>
            <CodeBlock code="# Hacer el script ejecutable
sudo chmod +x /usr/local/bin/wifi-watchdog.sh" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Paso 3: Crear un servicio systemd</h3>
            <CodeBlock code="# Crear archivo de servicio
sudo nano /etc/systemd/system/wifi-watchdog.service" />
            <p className="text-sm text-gray-600 mb-2">Contenido del servicio:</p>
            <CodeBlock code="[Unit]
Description=WiFi reconnection watchdog
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/wifi-watchdog.sh" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Paso 4: Crear un timer systemd</h3>
            <CodeBlock code="# Crear archivo del timer
sudo nano /etc/systemd/system/wifi-watchdog.timer" />
            <p className="text-sm text-gray-600 mb-2">Contenido del timer:</p>
            <CodeBlock code="[Unit]
Description=Ejecuta el watchdog WiFi cada minuto

[Timer]
OnBootSec=30
OnUnitActiveSec=60

[Install]
WantedBy=timers.target" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Paso 5: Activar el timer</h3>
            <CodeBlock code="# Recargar los servicios
sudo systemctl daemon-reexec
sudo systemctl daemon-reload

# Activar y arrancar el watchdog
sudo systemctl enable --now wifi-watchdog.timer

# Verificar su estado
systemctl list-timers --all | grep wifi" />
          </div>
        </div>
      </section>

      {/* Verificación y Solución de Problemas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">🔍 Verificación y Solución de Problemas</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Verificar estado del WiFi</h3>
            <CodeBlock code={`# Ver estado de la conexión
nmcli device status

# Ver detalles específicos de una conexión
nmcli connection show "AlfredSmart" | grep -E "(IP4|wifi)"`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Revisar logs del watchdog</h3>
            <CodeBlock code="# Ver logs del watchdog
cat /var/log/wifi-watchdog.log

# Ver logs del servicio
journalctl -u wifi-watchdog.service

# Ver logs de NetworkManager
journalctl -u NetworkManager -f" />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Reiniciar conexión WiFi manualmente</h3>
            <CodeBlock code={`# Desconectar y volver a conectar
nmcli connection down "AlfredSmart"
nmcli connection up "AlfredSmart"

# O reiniciar la interfaz completa
sudo ip link set wlan0 down
sudo ip link set wlan0 up`} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Solución de problemas comunes</h3>
            <CodeBlock code="# Ver si el dispositivo WiFi está disponible
nmcli device

# Ver si NetworkManager está activo
systemctl status NetworkManager

# Reiniciar NetworkManager si es necesario
sudo systemctl restart NetworkManager

# Ver información detallada del dispositivo
nmcli device show wlan0" />
          </div>
        </div>
      </section>

      {/* Notas Importantes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2 text-black">📝 Notas Importantes</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="space-y-3 text-blue-800">
            <p><strong>1. Personalización:</strong> Asegúrate de reemplazar <code>"AlfredSmart"</code> con el nombre real de tu conexión WiFi.</p>
            <p><strong>2. Logs:</strong> El watchdog crea logs en <code>/var/log/wifi-watchdog.log</code> que pueden ser útiles para diagnosticar problemas.</p>
            <p><strong>3. Intervalo de comprobación:</strong> El watchdog se ejecuta cada minuto por defecto. Puedes ajustar esto modificando <code>OnUnitActiveSec=60</code> en el archivo del timer.</p>
            <p><strong>4. Múltiples redes WiFi:</strong> Si tienes varias redes configuradas, el watchdog solo intentará reconectar a la especificada en <code>WIFI_CONN</code>.</p>
            <p><strong>5. Seguridad:</strong> El script del watchdog se ejecuta con permisos de usuario normal, no requiere sudo para la reconexión básica.</p>
            <p><strong>6. Rendimiento:</strong> El watchdog tiene un impacto mínimo en el rendimiento del sistema, ya que solo se ejecuta una vez por minuto.</p>
          </div>
        </div>
      </section>
    </div>
  );
}