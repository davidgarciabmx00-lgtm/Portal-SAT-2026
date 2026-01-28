// src/components/layout/calendar-sidebar.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WeeklyCalendar from '@/components/calendar/weekly-calendar';
import TaskForm from '@/components/tasks/task-form';
import Button from '@/components/ui/button';

interface Technician {
  id: string;
  name: string;
  city: string;
}

interface Task {
  id: string;
  technicianId: string;
  technicianName: string;
  startDate: any;
  endDate: any;
  description: string;
  links: string[];
}

interface CalendarSidebarProps {
  isCollapsed: boolean;
}

const CalendarSidebar = ({ isCollapsed }: CalendarSidebarProps) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date().toISOString().split('T')[0]);
  const { user, userRole } = useAuth();

  useEffect(() => {
    fetchTechnicians();
  }, []);

  useEffect(() => {
    if (currentWeek) {
      fetchTasks();
    }
  }, [currentWeek, selectedTechnician]);

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('/api/technicians');
      if (response.ok) {
        const data = await response.json();
        setTechnicians(data);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = await user?.getIdToken();
      if (!token) return;

      const params = new URLSearchParams({
        weekStart: currentWeek,
      });
      if (selectedTechnician) {
        params.append('technicianId', selectedTechnician);
      }
      const response = await fetch(`/api/tasks?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-800 text-white flex flex-col items-center py-4">
        <span className="material-symbols-outlined text-2xl mb-4">calendar_today</span>
        <span className="text-xs transform -rotate-90 whitespace-nowrap">Calendario</span>
      </div>
    );
  }

  return (
    <div className="w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col hidden md:flex">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Calendario de Tareas</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Técnico</label>
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Todos los técnicos</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.city}
                </option>
              ))}
            </select>
          </div>

          {userRole === 'admin' && (
            <Button onClick={() => setIsTaskFormOpen(true)} className="w-full">
              Nueva Tarea
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <WeeklyCalendar tasks={tasks} onWeekChange={setCurrentWeek} />
      </div>

      {isTaskFormOpen && (
        <TaskForm
          onClose={() => setIsTaskFormOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default CalendarSidebar;
