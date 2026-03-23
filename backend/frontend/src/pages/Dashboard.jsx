import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, X, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [pendientes, setPendientes] = useState([]);
  const [completadas, setCompletadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(null); // 'pendientes' | 'completadas' | null
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resPendientes, resCompletadas] = await Promise.all([
        api.get('/tareas/estado/pendientes'),
        api.get('/tareas/estado/completadas'),
      ]);
      setPendientes(resPendientes.data);
      setCompletadas(resCompletadas.data);
    } catch (error) {
      toast.error('Error al cargar datos del panel de control');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await api.patch(`/tareas/${id}/completar`);
      toast.success('Tarea completada');
      fetchData();
    } catch (error) {
      toast.error('Error al actualizar tarea');
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div></div></div>;
  }

  const total = pendientes.length + completadas.length;
  const progreso = total === 0 ? 0 : Math.round((completadas.length / total) * 100);

  const activeList = viewMode === 'pendientes' ? pendientes : completadas;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Hola, {user?.nombre}! 👋</h2>
        <p className="text-gray-600 dark:text-gray-400">Aquí tienes un resumen de tu progreso actual.</p>
        
        <div className="mt-6 flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4">
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mt-2 flex-grow">
            <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progreso}%` }}></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 sm:mt-0 min-w-[3rem]">{progreso}% completado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setViewMode('pendientes')}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="p-3 bg-red-100/50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tareas Pendientes</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendientes.length}</p>
          </div>
        </div>
        
        <div 
          onClick={() => setViewMode('completadas')}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4 cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="p-3 bg-green-100/50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tareas Completadas</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{completadas.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Próximas a vencer</h3>
        {pendientes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay tareas pendientes. ¡Buen trabajo!</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {pendientes.slice(0, 5).map(tarea => (
              <div key={tarea.id_tarea} className="py-3 flex justify-between items-center group cursor-pointer" onClick={() => {setViewMode('pendientes'); setExpandedTaskId(tarea.id_tarea);}}>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tarea.titulo}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{tarea.materia}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    {new Date(tarea.fecha_entrega).toLocaleDateString()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Tareas */}
      {viewMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {viewMode === 'pendientes' ? 'Tareas Pendientes' : 'Tareas Completadas'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click en una tarea para ver descripción</p>
              </div>
              <button 
                onClick={() => {setViewMode(null); setExpandedTaskId(null);}}
                className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeList.map(tarea => (
                <div 
                  key={tarea.id_tarea}
                  className={`border rounded-xl transition-all ${
                    expandedTaskId === tarea.id_tarea 
                      ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10 dark:bg-blue-900/10' 
                      : 'border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedTaskId(expandedTaskId === tarea.id_tarea ? null : tarea.id_tarea)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{tarea.titulo}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{tarea.materia} • {new Date(tarea.fecha_entrega).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      {viewMode === 'pendientes' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteTask(tarea.id_tarea);
                          }}
                          className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          title="Marcar como terminada"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedTaskId === tarea.id_tarea ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {expandedTaskId === tarea.id_tarea && (
                    <div className="px-4 pb-4 pt-0 text-sm text-gray-600 dark:text-gray-300 animate-in slide-in-from-top-2 duration-200">
                      <div className="h-px bg-gray-100 dark:bg-slate-700 mb-4" />
                      <p className="italic">Descripción:</p>
                      <p className="mt-1 whitespace-pre-wrap">{tarea.descripcion || 'Sin descripción disponible.'}</p>
                    </div>
                  )}
                </div>
              ))}
              {activeList.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay tareas para mostrar.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-slate-700 text-center bg-gray-50/50 dark:bg-slate-900/50">
              <button 
                onClick={() => setViewMode(null)}
                className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
