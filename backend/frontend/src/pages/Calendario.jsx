import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Calendario() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    try {
      const { data } = await api.get('/tareas');
      const eventsFormatted = data.map(t => ({
        id: t.id_tarea,
        title: `${t.materia}: ${t.titulo}`,
        date: t.fecha_entrega.split('T')[0],
        backgroundColor: t.completada ? '#22c55e' : '#ef4444', // Tailwind green-500 y red-500
        borderColor: t.completada ? '#16a34a' : '#dc2626',
        allDay: true,
        extendedProps: {
          descripcion: t.descripcion,
          completada: t.completada
        }
      }));
      setEventos(eventsFormatted);
    } catch (error) {
      toast.error('Error al cargar calendario');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    const p = clickInfo.event.extendedProps;
    alert(`Materia y Tarea: ${clickInfo.event.title}\nDescripción: ${p.descripcion || 'Sin descripción'}\nEstado: ${p.completada ? 'Completada' : 'Pendiente'}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Calendario de Entregas</h2>
      <div className="calendar-container dark:text-gray-300">
        {loading ? (
          <p>Cargando calendario...</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={eventos}
            eventClick={handleEventClick}
            height="auto"
            locale={esLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
          />
        )}
      </div>
      <style jsx="true">{`
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #e5e7eb;
        }
        .dark .fc-theme-standard td, .dark .fc-theme-standard th {
          border-color: #334155;
        }
        .dark .fc-col-header-cell-cushion {
          color: #f1f5f9;
        }
        .dark .fc-daygrid-day-number {
          color: #94a3b8;
        }
        .fc-event {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
