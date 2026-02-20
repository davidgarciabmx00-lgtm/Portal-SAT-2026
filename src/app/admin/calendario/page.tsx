'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface BlockedSlot {
  eventId: string;
  start: string;
  end: string;
  reason: string;
}

interface AvailableSlot {
  start: string;
}

export default function AdminCalendarPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      router.push('/');
    }
  }, [user, userRole, authLoading, router]);

  /* ── Fetch data ── */
  const fetchData = useCallback(async () => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);
    const qs = 'start=' + start.toISOString() + '&end=' + end.toISOString();

    const [avRes, blRes] = await Promise.all([
      fetch('/api/appointments/availability?' + qs),
      fetch('/api/appointments/block?' + qs),
    ]);

    const avData = await avRes.json();
    const blData = await blRes.json();
    setAvailable(avData.availableSlots || []);
    setBlocked(blData.blocked || []);
  }, []);

  useEffect(() => {
    if (user && userRole === 'admin') fetchData();
  }, [user, userRole, fetchData]);

  /* ── Calendar events ── */
  const events = useMemo(() => {
    const avEvents = available.map((s, i) => ({
      id: 'av-' + i,
      title: 'Disponible',
      start: s,
      end: new Date(new Date(s).getTime() + 3600000).toISOString(),
      color: '#22c55e',
      extendedProps: { type: 'available', slot: s },
    }));

    const blEvents = blocked.map((b) => ({
      id: 'bl-' + b.eventId,
      title: 'BLOQUEADO',
      start: b.start,
      end: b.end,
      color: '#ef4444',
      extendedProps: { type: 'blocked', eventId: b.eventId, reason: b.reason },
    }));

    return [...avEvents, ...blEvents];
  }, [available, blocked]);

  /* ── Block a slot ── */
  const blockSlot = async (dateTime: string, reason: string) => {
    setLoadingAction(true);
    try {
      const res = await fetch('/api/appointments/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateTime, reason }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        alert('Error al bloquear la franja');
      }
    } catch {
      alert('Error de conexion');
    }
    setLoadingAction(false);
  };

  /* ── Unblock a slot ── */
  const unblockSlot = async (eventId: string) => {
    setLoadingAction(true);
    try {
      const res = await fetch('/api/appointments/block', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        alert('Error al desbloquear la franja');
      }
    } catch {
      alert('Error de conexion');
    }
    setLoadingAction(false);
  };

  /* ── Event click handler ── */
  const handleEventClick = useCallback(
    (arg: any) => {
      if (loadingAction) return;
      const props = arg.event.extendedProps;

      if (props.type === 'available') {
        const reason = prompt(
          'Bloquear franja: ' +
            new Date(props.slot).toLocaleString('es-ES', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }) +
            '\n\nMotivo (opcional):'
        );
        if (reason !== null) {
          blockSlot(props.slot, reason || '');
        }
      } else if (props.type === 'blocked') {
        const ok = confirm(
          'Desbloquear esta franja?\n\n' +
            new Date(arg.event.start).toLocaleString('es-ES', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }) +
            (props.reason ? '\nMotivo: ' + props.reason : '')
        );
        if (ok) {
          unblockSlot(props.eventId);
        }
      }
    },
    [loadingAction]
  );

  if (authLoading || !user || userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <style>{calendarCSS}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gestion de Disponibilidad
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Haz clic en una franja verde para bloquearla o en una roja para desbloquearla
              </p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Volver al Panel
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-500 inline-block" />
            <span className="text-sm text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-500 inline-block" />
            <span className="text-sm text-gray-600">Bloqueado</span>
          </div>
        </div>

        {/* Loading overlay */}
        {loadingAction && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
            <p className="text-blue-700 text-sm">Procesando...</p>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4 overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventDisplay="block"
            eventClick={handleEventClick}
            height="auto"
            contentHeight={650}
            slotMinTime="09:00:00"
            slotMaxTime="19:00:00"
            expandRows
            businessHours={[
              { daysOfWeek: [1, 2, 3, 4], startTime: '09:00', endTime: '14:00' },
              { daysOfWeek: [1, 2, 3, 4], startTime: '15:00', endTime: '18:00' },
              { daysOfWeek: [5], startTime: '09:00', endTime: '14:00' },
            ]}
            locale="es"
            timeZone="local"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Dia',
            }}
            slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
            eventTimeFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
          />
        </div>
      </div>
    </div>
  );
}

const calendarCSS = `
  .fc .fc-event { border-radius: 4px; cursor: pointer; transition: filter .15s; }
  .fc .fc-event:hover { filter: brightness(.85); }
  .fc .fc-toolbar-title { font-size: 1.1rem !important; }
`;
