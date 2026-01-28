// src/components/admin/technician-manager.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/button';

interface Technician {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
}

const TechnicianManager = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [newTechnician, setNewTechnician] = useState({ name: '', city: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTechnicians();
  }, []);

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

  const handleCreateTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechnician.name || !newTechnician.city) return;

    setIsLoading(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/technicians', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTechnician),
      });

      if (response.ok) {
        setNewTechnician({ name: '', city: '' });
        fetchTechnicians();
      } else {
        alert('Error al crear técnico');
      }
    } catch (error) {
      console.error('Error creating technician:', error);
      alert('Error al crear técnico');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateTechnician = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este técnico? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/technicians/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Actualizar la lista de técnicos eliminando el técnico desactivado
        setTechnicians(technicians.filter(tech => tech.id !== id));
        alert('Técnico eliminado exitosamente');
      } else {
        const error = await response.json();
        alert(`Error al eliminar técnico: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting technician:', error);
      alert('Error al eliminar técnico');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black">Gestión de Técnicos</h2>

      <form onSubmit={handleCreateTechnician} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={newTechnician.name}
            onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
            placeholder="Nombre del técnico"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <select
            value={newTechnician.city}
            onChange={(e) => setNewTechnician({ ...newTechnician, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          >
            <option value="">Seleccionar ciudad</option>
            <option value="Madrid">Madrid</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Sevilla">Sevilla</option>
          </select>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Técnico'}
        </Button>
      </form>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-black">Técnicos Registrados</h3>
        {technicians.length === 0 ? (
          <p className="text-gray-500">No hay técnicos registrados</p>
        ) : (
          technicians.map((tech) => (
            <div key={tech.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
              <div>
                <p className="font-medium text-black">{tech.name}</p>
                <p className="text-sm text-gray-600">{tech.city}</p>
              </div>
              <Button
                onClick={() => handleDeactivateTechnician(tech.id)}
                variant="secondary"
              >
                Eliminar
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnicianManager;