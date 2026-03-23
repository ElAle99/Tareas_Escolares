import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', profesor: '', id_periodo: '', color: '#3B82F6' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resMaterias, resPeriodos] = await Promise.all([
        api.get('/materias'),
        api.get('/periodos')
      ]);
      setMaterias(resMaterias.data);
      setPeriodos(resPeriodos.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/materias/${editingId}`, formData);
        toast.success('Materia actualizada');
      } else {
        await api.post('/materias', formData);
        toast.success('Materia creada');
      }
      setFormData({ nombre: '', profesor: '', id_periodo: '', color: '#3B82F6' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleEdit = (m) => {
    setFormData({ 
      nombre: m.nombre, 
      profesor: m.profesor || '', 
      id_periodo: m.id_periodo,
      color: m.color || '#3B82F6'
    });
    setEditingId(m.id_materia);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta materia?')) return;
    try {
      await api.delete(`/materias/${id}`);
      toast.success('Materia eliminada');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {editingId ? 'Editar Materia' : 'Nueva Materia'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profesor (Opcional)</label>
            <input type="text" className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.profesor} onChange={(e) => setFormData({...formData, profesor: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periodo</label>
            <select required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.id_periodo} onChange={(e) => setFormData({...formData, id_periodo: e.target.value})}>
              <option value="">Seleccione</option>
              {periodos.map(p => (
                <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <div className="w-10">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
              <input type="color" className="w-full h-10 p-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} />
            </div>
            <div className="flex-1 flex flex-col justify-end pb-0.5">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
                {editingId ? 'Guardar' : <Plus className="w-4 h-4"/>}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
        ) : materias.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">No hay materias registradas</p>
        ) : (
          materias.map(m => (
            <div key={m.id_materia} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 transition-transform hover:scale-[1.02]">
              <div className="h-2 w-full" style={{ backgroundColor: m.color || '#3B82F6' }}></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate">{m.nombre}</h4>
                  <div className="flex space-x-2 ml-2 flex-shrink-0">
                    <button onClick={() => handleEdit(m)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m.id_materia)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Prof: {m.profesor || 'N/A'}</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300 mt-2">
                  Periodo: {m.periodo}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
