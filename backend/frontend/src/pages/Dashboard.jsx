import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [pendientes, setPendientes] = useState([]);
  const [completadas, setCompletadas] = useState([]);
  const [loading, setLoading] = useState(true);

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
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div></div></div>;
  }

  const total = pendientes.length + completadas.length;
  const progreso = total === 0 ? 0 : Math.round((completadas.length / total) * 100);

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
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-red-100/50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tareas Pendientes</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendientes.length}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center space-x-4">
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
              <div key={tarea.id_tarea} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tarea.titulo}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{tarea.materia}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  {new Date(tarea.fecha_entrega).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
