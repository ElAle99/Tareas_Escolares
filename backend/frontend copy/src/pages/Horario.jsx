import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Horario() {
  const [horarios, setHorarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ dia_semana: 'Lun', hora_inicio: '07:00', hora_fin: '09:00', id_materia: '' });

  const dias = [
    { id: 'Lun', nombre: 'Lunes' },
    { id: 'Mar', nombre: 'Martes' },
    { id: 'Mie', nombre: 'Miércoles' },
    { id: 'Jue', nombre: 'Jueves' },
    { id: 'Vie', nombre: 'Viernes' },
    { id: 'Sab', nombre: 'Sábado' }
  ];
  const horasPosibles = Array.from({length: 15}, (_, i) => `${String(i+7).padStart(2,'0')}:00`);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resHorarios, resMaterias] = await Promise.all([
        api.get('/horarios'),
        api.get('/materias')
      ]);
      setHorarios(resHorarios.data);
      setMaterias(resMaterias.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/horarios', formData);
      toast.success('Horario añadido');
      setFormData({ ...formData, id_materia: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar bloque de horario?')) return;
    try {
      await api.delete(`/horarios/${id}`);
      toast.success('Horario eliminado');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  // Helper para buscar color de la materia
  const getColorMateria = (id_materia) => {
    const mat = materias.find(m => m.id_materia === id_materia);
    return mat?.color || '#3B82F6';
  };

  // Preparación de la matriz del horario
  const tableMatrix = {};
  horasPosibles.forEach(hora => {
    tableMatrix[hora] = {};
    dias.forEach(d => {
      tableMatrix[hora][d.id] = { skip: false, event: null, rowSpan: 1 };
    });
  });

  horarios.forEach(h => {
    const startH = parseInt(h.hora_inicio.substring(0, 2));
    const endH = parseInt(h.hora_fin.substring(0, 2));
    const span = Math.max(1, endH - startH);
    const startStr = `${String(startH).padStart(2, '0')}:00`;
    
    if (tableMatrix[startStr] && tableMatrix[startStr][h.dia_semana] !== undefined) {
      if (!tableMatrix[startStr][h.dia_semana].event) {
        tableMatrix[startStr][h.dia_semana].event = h;
        tableMatrix[startStr][h.dia_semana].rowSpan = span;
        for (let i = 1; i < span; i++) {
          const nextH = startH + i;
          const nextStr = `${String(nextH).padStart(2, '0')}:00`;
          if (tableMatrix[nextStr] && tableMatrix[nextStr][h.dia_semana] !== undefined) {
            tableMatrix[nextStr][h.dia_semana].skip = true;
          }
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Añadir Bloque de Horario</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Día</label>
            <select className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none" value={formData.dia_semana} onChange={(e) => setFormData({...formData, dia_semana: e.target.value})}>
              {dias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora Inicio</label>
            <input type="time" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none" value={formData.hora_inicio} onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora Fin</label>
            <input type="time" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none" value={formData.hora_fin} onChange={(e) => setFormData({...formData, hora_fin: e.target.value})} />
          </div>
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Materia</label>
            <select required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none text-sm" value={formData.id_materia} onChange={(e) => setFormData({...formData, id_materia: e.target.value})}>
              <option value="">Seleccione materia</option>
              {materias.map(m => (
                <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2"/> Añadir
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-200 dark:border-slate-700 p-3 bg-gray-50 dark:bg-slate-900 w-24">Hora</th>
              {dias.map(d => (
                <th key={d.id} className="border border-gray-200 dark:border-slate-700 p-3 bg-gray-50 dark:bg-slate-900 text-center font-semibold text-gray-700 dark:text-gray-300">{d.nombre}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horasPosibles.map((hora) => (
              <tr key={hora}>
                <td className="border border-gray-200 dark:border-slate-700 p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {hora}
                </td>
                {dias.map(dia => {
                  const cellData = tableMatrix[hora][dia.id];
                  if (cellData.skip) return null; // saltar si está ocupada

                  if (cellData.event) {
                    const c = cellData.event;
                    return (
                      <td key={`${dia.id}-${hora}`} rowSpan={cellData.rowSpan} className="border border-gray-200 dark:border-slate-700 p-0 relative align-top bg-white dark:bg-slate-800">
                        <div className="w-full h-full p-2 text-xs text-white relative group flex flex-col justify-center items-center text-center overflow-hidden"
                             style={{ backgroundColor: getColorMateria(c.id_materia), minHeight: `${cellData.rowSpan * 4}rem` }}>
                          <p className="font-bold truncate w-full px-1">{c.materia}</p>
                          <p className="opacity-90 mt-1">{c.hora_inicio.substring(0,5)} - {c.hora_fin.substring(0,5)}</p>
                          <button 
                            onClick={() => handleDelete(c.id_horario)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity bg-black/20 rounded p-0.5 z-10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={`${dia.id}-${hora}`} className="border border-gray-200 dark:border-slate-700 p-1 relative h-16 min-w-[120px] bg-white dark:bg-slate-800"></td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
