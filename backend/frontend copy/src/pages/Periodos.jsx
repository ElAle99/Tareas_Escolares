import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Periodos() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', fecha_inicio: '', fecha_fin: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const fetchPeriodos = async () => {
    try {
      const { data } = await api.get('/periodos');
      setPeriodos(data);
    } catch (error) {
      toast.error('Error al cargar los periodos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/periodos/${editingId}`, formData);
        toast.success('Periodo actualizado');
      } else {
        await api.post('/periodos', formData);
        toast.success('Periodo creado');
      }
      setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '' });
      setEditingId(null);
      fetchPeriodos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleEdit = (p) => {
    setFormData({ 
      nombre: p.nombre, 
      fecha_inicio: p.fecha_inicio.split('T')[0], 
      fecha_fin: p.fecha_fin.split('T')[0] 
    });
    setEditingId(p.id_periodo);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este periodo?')) return;
    try {
      await api.delete(`/periodos/${id}`);
      toast.success('Periodo eliminado');
      fetchPeriodos();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {editingId ? 'Editar Periodo' : 'Nuevo Periodo'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre (ej. 2025-1)</label>
            <input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Inicio</label>
            <input type="date" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.fecha_inicio} onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Fin</label>
            <input type="date" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.fecha_fin} onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})} />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
              {editingId ? 'Actualizar' : <><Plus className="w-4 h-4 mr-2"/> Crear</>}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '' }); }} className="px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fin</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700 text-sm text-gray-700 dark:text-gray-300">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Cargando...</td></tr>
            ) : periodos.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No hay periodos registrados</td></tr>
            ) : (
              periodos.map(p => (
                <tr key={p.id_periodo} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{p.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(p.fecha_inicio).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(p.fecha_fin).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id_periodo)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
