// src/components/calendar/weekly-calendar.tsx
'use client';
import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: string;
  technicianName: string;
  startDate: any; // Can be Firestore Timestamp, Date, or serialized timestamp
  endDate: any; // Can be Firestore Timestamp, Date, or serialized timestamp
  description: string;
  links: string[];
  address?: string;
}

interface WeeklyCalendarProps {
  tasks: Task[];
  onWeekChange?: (weekStart: string) => void;
  onTaskDeleted?: () => void;
}

const WeeklyCalendar = ({ tasks, onWeekChange, onTaskDeleted }: WeeklyCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { user, userRole } = useAuth();

  // Helper function to convert different date formats to Date objects
  const toDate = (dateValue: any): Date => {
    if (dateValue && typeof dateValue.toDate === 'function') {
      // Firestore Timestamp
      return dateValue.toDate();
    } else if (dateValue && dateValue._seconds) {
      // Serialized Firestore Timestamp
      return new Date(dateValue._seconds * 1000);
    } else if (dateValue instanceof Date) {
      // Already a Date object
      return dateValue;
    } else if (typeof dateValue === 'string') {
      // ISO string
      return new Date(dateValue);
    } else {
      // Fallback
      return new Date();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onTaskDeleted?.();
      } else {
        alert('Error al eliminar la tarea');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const handleTaskClick = (task: Task, event: React.MouseEvent) => {
    // Si se hizo clic en el botón de eliminar, no abrir el modal
    if ((event.target as HTMLElement).closest('.delete-button')) {
      return;
    }
    setSelectedTask(task);
  };

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(currentWeek, i));
  }

  const renderTasksForDay = (day: Date) => {
    return tasks
      .filter(task => {
        const taskStart = toDate(task.startDate);
        const taskEnd = toDate(task.endDate);
        return isSameDay(day, taskStart) || isWithinInterval(day, { start: taskStart, end: taskEnd });
      })
      .map(task => (
        <div
          key={task.id}
          className="bg-blue-500 text-white text-xs p-2 rounded mb-1 cursor-pointer hover:bg-blue-600 relative group"
          onClick={(e) => handleTaskClick(task, e)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{task.technicianName}</p>
              <p className="truncate">{task.description}</p>
              {task.links.length > 0 && (
                <p className="text-xs opacity-75">Enlaces: {task.links.length}</p>
              )}
            </div>
            {userRole === 'admin' && (
              <button
                className="delete-button ml-2 text-red-300 hover:text-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                title="Eliminar tarea"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        </div>
      ));
  };

  const goToPreviousWeek = () => {
    const newWeek = addDays(currentWeek, -7);
    setCurrentWeek(newWeek);
    onWeekChange?.(format(newWeek, 'yyyy-MM-dd'));
  };

  const goToNextWeek = () => {
    const newWeek = addDays(currentWeek, 7);
    setCurrentWeek(newWeek);
    onWeekChange?.(format(newWeek, 'yyyy-MM-dd'));
  };

  const goToCurrentWeek = () => {
    const newWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeek(newWeek);
    onWeekChange?.(format(newWeek, 'yyyy-MM-dd'));
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold text-black">Planificación Semanal</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={goToPreviousWeek}
              className="px-2 py-1 md:px-3 text-sm bg-gray-200 text-black rounded hover:bg-gray-300"
            >
              <span className="hidden sm:inline">← Semana Anterior</span>
              <span className="sm:hidden">←</span>
            </button>
            <button
              onClick={goToCurrentWeek}
              className="px-2 py-1 md:px-3 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <span className="hidden sm:inline">Esta Semana</span>
              <span className="sm:hidden">Hoy</span>
            </button>
            <button
              onClick={goToNextWeek}
              className="px-2 py-1 md:px-3 text-sm bg-gray-200 text-black rounded hover:bg-gray-300"
            >
              <span className="hidden sm:inline">Semana Siguiente →</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-xs font-medium text-gray-700">
          {weekDays.map(day => (
            <div key={day.toString()} className="p-1 md:p-2 border rounded">
              <div className="hidden sm:block">{format(day, 'EEE', { locale: es })}</div>
              <div className={`text-sm md:text-lg ${format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') ? 'bg-blue-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 mx-auto flex items-center justify-center' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 mt-2">
          {weekDays.map(day => (
            <div key={day.toString()} className="border rounded p-1 md:p-2 h-32 md:h-64 overflow-y-auto text-xs">
              {renderTasksForDay(day)}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalles de tarea */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">Detalles de la Tarea</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Técnico</label>
                <p className="text-black font-semibold">{selectedTask.technicianName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                  <p className="text-black">{format(toDate(selectedTask.startDate), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
                  <p className="text-black">{format(toDate(selectedTask.startDate), 'HH:mm')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                  <p className="text-black">{format(toDate(selectedTask.endDate), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora Fin</label>
                  <p className="text-black">{format(toDate(selectedTask.endDate), 'HH:mm')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <p className="text-black">{selectedTask.description}</p>
              </div>

              {selectedTask.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <p className="text-black">{selectedTask.address}</p>
                </div>
              )}

              {selectedTask.links.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enlaces</label>
                  <div className="space-y-1">
                    {selectedTask.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline block text-sm"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeeklyCalendar;