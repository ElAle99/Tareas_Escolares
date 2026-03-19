import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', fecha_entrega: '', id_materia: '' });
  const [editingId, setEditingId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todas'); // todas, pendientes, completadas

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resTareas, resMaterias] = await Promise.all([
        api.get('/tareas'), // endpoint created to list all
        api.get('/materias')
      ]);
      setTareas(resTareas.data);
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
      if (editingId) {
        await api.put(`/tareas/${editingId}`, formData);
        toast.success('Tarea actualizada');
      } else {
        await api.post('/tareas', formData);
        toast.success('Tarea creada');
      }
      setFormData({ titulo: '', descripcion: '', fecha_entrega: '', id_materia: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleEdit = (t) => {
    setFormData({ 
      titulo: t.titulo, 
      descripcion: t.descripcion || '', 
      fecha_entrega: t.fecha_entrega.split('T')[0],
      id_materia: t.id_materia
    });
    setEditingId(t.id_tarea);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    try {
      await api.delete(`/tareas/${id}`);
      toast.success('Tarea eliminada');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const toggleComplete = async (id) => {
    try {
      await api.patch(`/tareas/${id}/completar`);
      toast.success('Estado actualizado');
      fetchData();
    } catch (error) {
      toast.error('Error al actualizar tarea');
    }
  };

  const currentTareas = tareas.filter(t => {
    if (filtroEstado === 'completadas') return t.completada;
    if (filtroEstado === 'pendientes') return !t.completada;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {editingId ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input type="text" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <input type="text" className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Materia</label>
            <select required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none text-sm" value={formData.id_materia} onChange={(e) => setFormData({...formData, id_materia: e.target.value})}>
              <option value="">Seleccione</option>
              {materias.map(m => (
                <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Entrega</label>
            <input type="date" required className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg outline-none" value={formData.fecha_entrega} onChange={(e) => setFormData({...formData, fecha_entrega: e.target.value})} />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center">
              {editingId ? 'Actualizar' : <><Plus className="w-4 h-4 mr-1"/> Crear</>}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Lista de Tareas</h3>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none dark:text-white"
          >
            <option value="todas">Todas</option>
            <option value="pendientes">Pendientes</option>
            <option value="completadas">Completadas</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-500">Cargando tareas...</p>
          ) : currentTareas.length === 0 ? (
            <p className="text-gray-500 col-span-full">No se encontraron tareas</p>
          ) : (
            currentTareas.map(t => {
              const isOverdue = !t.completada && new Date(t.fecha_entrega) < new Date();
              return (
                <div key={t.id_tarea} className={`relative p-5 rounded-xl border ${t.completada ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/40 opacity-80' : isOverdue ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/40' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'} shadow-sm transition-all hover:shadow-md`}>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-semibold ${t.completada ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white text-lg'}`}>{t.titulo}</h4>
                    <button 
                      onClick={() => toggleComplete(t.id_tarea)} 
                      className={`flex-shrink-0 p-1 rounded-full ${t.completada ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900' : 'text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                    >
                      {t.completada ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden text-ellipsis">{t.descripcion || 'Sin descripción'}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300">
                      {t.materia}
                    </span>
                    <span className={`text-xs font-medium ${isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                      {new Date(t.fecha_entrega).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="absolute top-2 right-12 hidden group-hover:flex space-x-1 opacity-0 hover:opacity-100 transition-opacity" style={{opacity: 1}}>
                    <button onClick={() => handleEdit(t)} className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 absolute -top-4 right-8 border border-gray-100 dark:border-slate-600"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(t.id_tarea)} className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 absolute -top-4 right-0 border border-gray-100 dark:border-slate-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
