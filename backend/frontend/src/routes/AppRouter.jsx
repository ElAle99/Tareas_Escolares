import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { ProtectedRoute } from './ProtectedRoute';
import Layout from '../components/Layout';

import Dashboard from '../pages/Dashboard';
import Periodos from '../pages/Periodos';
import Materias from '../pages/Materias';
import Horario from '../pages/Horario';
import Tareas from '../pages/Tareas';
import Calendario from '../pages/Calendario';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/periodos" element={<Periodos />} />
                <Route path="/materias" element={<Materias />} />
                <Route path="/horario" element={<Horario />} />
                <Route path="/tareas" element={<Tareas />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
