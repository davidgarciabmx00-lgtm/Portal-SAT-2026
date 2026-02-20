'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

/* ── Types ── */
interface SurveyForm {
  name: string;
  email: string;
  city: string;
  address: string;
  phone: string;
  callPreference: string;
  description: string;
  dateTime: string;
}

const emptySurvey: SurveyForm = {
  name: '',
  email: '',
  city: '',
  address: '',
  phone: '',
  callPreference: '',
  description: '',
  dateTime: '',
};

/* ── Mobile hook ── */
function useIsMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < bp);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, [bp]);
  return m;
}

/* ════════════════════════════════════════════════════════
   Main component
   ════════════════════════════════════════════════════════ */
export default function AppointmentPage() {
  const isMobile = useIsMobile();
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<SurveyForm>(emptySurvey);
  const [loading, setLoading] = useState(false);

  /* ── Fetch availability ── */
  const fetchAvailability = useCallback(async () => {
    try {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 30);
      const res = await fetch(
        '/api/appointments/availability?start=' +
          start.toISOString() +
          '&end=' +
          end.toISOString()
      );
      const data = await res.json();
      setSlots(data.availableSlots || []);
    } catch {
      setSlots([]);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  /* ── Calendar events ── */
  const events = useMemo(
    () =>
      slots.map((s, i) => ({
        id: 'slot-' + i,
        title: 'Disponible',
        start: s,
        end: new Date(new Date(s).getTime() + 3600000).toISOString(),
      })),
    [slots]
  );

  /* ── Event click handler: open modal when clicking a green slot ── */
  const handleEventClick = useCallback(
    (arg: any) => {
      const event = arg.event;
      const startStr = event.startStr || event.start?.toISOString();
      if (startStr) {
        setSelectedSlot(startStr);
        setForm({ ...emptySurvey, dateTime: startStr });
        setShowModal(true);
      }
    },
    []
  );

  /* ── Close modal ── */
  const closeModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
    setForm(emptySurvey);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      dateTime: form.dateTime,
      description: [
        form.description,
        '',
        '--- Datos de la encuesta ---',
        'Ciudad: ' + form.city,
        'Direccion: ' + form.address,
        'Preferencia de jornada: ' + form.callPreference,
      ].join('\n'),
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert('Cita agendada exitosamente. Revisa tu correo para confirmacion.');
        closeModal();
        fetchAvailability();
      } else {
        alert('Error al agendar cita.');
      }
    } catch {
      alert('Error de conexion.');
    }
    setLoading(false);
  };

  /* ── Field updater ── */
  const set = (key: keyof SurveyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  /* ════════ RENDER ════════ */
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <style>{calendarCSS}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            Agendar Visita Tecnica
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
            Selecciona una fecha y hora disponible en el calendario
          </p>
        </div>

        {/* Hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 sm:mb-6 max-w-xl mx-auto text-center">
          <p className="text-blue-700 text-xs sm:text-sm">
            {isMobile
              ? 'Toca una franja verde para agendar'
              : 'Haz clic en una franja verde del calendario para agendar tu visita'}
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4 overflow-hidden max-w-4xl mx-auto">
          <FullCalendar
            key={isMobile ? 'mob' : 'desk'}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
            headerToolbar={
              isMobile
                ? { left: 'prev,next', center: 'title', right: 'timeGridDay,dayGridMonth' }
                : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }
            }
            events={events}
            eventColor="#22c55e"
            eventTextColor="white"
            eventDisplay="block"
            eventClick={handleEventClick}
            height="auto"
            contentHeight={isMobile ? 480 : 600}
            dayMaxEvents={3}
            slotMinTime="09:00:00"
            slotMaxTime="18:00:00"
            expandRows
            businessHours={[
              { daysOfWeek: [1, 2, 3, 4], startTime: '09:00', endTime: '14:00' },
              { daysOfWeek: [1, 2, 3, 4], startTime: '15:00', endTime: '18:00' },
              { daysOfWeek: [5], startTime: '09:00', endTime: '14:00' },
            ]}
            locale="es"
            timeZone="local"
            buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Dia' }}
            titleFormat={isMobile ? { month: 'short', day: 'numeric' } : { year: 'numeric', month: 'long', day: 'numeric' }}
            dayHeaderFormat={isMobile ? { weekday: 'narrow' } : { weekday: 'short', day: 'numeric' }}
            slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
            eventTimeFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
          />
        </div>
      </div>

      {/* ═══════ MODAL OVERLAY ═══════ */}
      {showModal && selectedSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Card */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close btn */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors z-10"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 sm:px-6 sm:py-5 rounded-t-2xl text-white">
              <h2 className="text-base sm:text-lg font-bold">Encuesta de Visita Tecnica</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                {new Date(selectedSlot).toLocaleString('es-MX', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {/* Name */}
              <Field label="Nombre completo" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Juan Perez"
                  className={inputClass}
                  required
                />
              </Field>

              {/* Email */}
              <Field label="Correo electronico" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                  required
                />
              </Field>

              {/* Two-column row on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Ciudad" required>
                  <input
                    type="text"
                    value={form.city}
                    onChange={set('city')}
                    placeholder="Madrid"
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Numero de contacto" required>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+34 612 345 678"
                    className={inputClass}
                    required
                  />
                </Field>
              </div>

              {/* Address */}
              <Field label="Direccion" required>
                <input
                  type="text"
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Calle Gran Via 28, 28013"
                  className={inputClass}
                  required
                />
              </Field>

              {/* Call preference */}
              <Field label="Preferencia de jornada para recibir llamadas">
                <select
                  value={form.callPreference}
                  onChange={set('callPreference')}
                  className={inputClass}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Manana (8am - 12pm)">Manana (8am - 12pm)</option>
                  <option value="Tarde (12pm - 5pm)">Tarde (12pm - 5pm)</option>
                  <option value="Cualquier horario">Cualquier horario</option>
                </select>
              </Field>

              {/* Description */}
              <Field label="Breve descripcion del problema" required>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Describa brevemente el problema que tiene con su equipo..."
                  className={inputClass + ' resize-none'}
                  rows={3}
                  required
                />
              </Field>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Enviando...' : 'Agendar Visita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Reusable field wrapper ── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Shared input class ── */
const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-shadow';

/* ── FullCalendar + modal animation CSS ── */
const calendarCSS = `
  /* ── Mobile calendar ── */
  @media (max-width: 767px) {
    .fc .fc-toolbar { flex-wrap: wrap; gap: 4px; font-size: 0.75rem; }
    .fc .fc-toolbar-title { font-size: 0.9rem !important; }
    .fc .fc-button { padding: 4px 8px !important; font-size: 0.7rem !important; }
    .fc .fc-timegrid-slot-label { font-size: 0.65rem; }
    .fc .fc-col-header-cell-cushion { font-size: 0.7rem; padding: 2px !important; }
    .fc .fc-event { font-size: 0.65rem !important; padding: 1px 3px !important; }
    .fc .fc-timegrid-slot { height: 2em !important; }
    .fc .fc-scrollgrid { font-size: 0.75rem; }
  }
  @media (min-width: 768px) {
    .fc .fc-toolbar-title { font-size: 1.1rem !important; }
  }
  .fc .fc-event { border-radius: 4px; cursor: pointer; transition: filter .15s; }
  .fc .fc-event:hover { filter: brightness(.9); }

  /* ── Modal fade-in ── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-fade-in { animation: fadeIn .25s ease-out; }
`;
