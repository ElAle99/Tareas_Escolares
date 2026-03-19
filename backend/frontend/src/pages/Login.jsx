import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(correo, password);
      toast.success('Bienvenido de nuevo!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gestiona tus tareas escolares</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="alumno@escuela.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
