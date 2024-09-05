// src/components/Agenda.js
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enUS from 'date-fns/locale/en-US';

// Configurando localizador de data
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [filter, setFilter] = useState('All'); // Estado para filtro por profissional

  // Função para adicionar um novo evento
  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setNewEvent({ title: '', start: '', end: '' });
  };

  // Dados de exemplo de agendamentos e profissionais
  useEffect(() => {
    setEvents([
      { title: 'Consulta Dr. John', start: new Date(2024, 7, 27, 10, 0), end: new Date(2024, 7, 27, 11, 0), color: 'blue' },
      { title: 'Consulta Dra. Smith', start: new Date(2024, 7, 28, 12, 0), end: new Date(2024, 7, 28, 13, 0), color: 'green' },
    ]);
  }, []);

  return (
    <div className="agenda-container">
      <h2>Agenda</h2>
      <div className="filters">
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="All">Todos os Profissionais</option>
          <option value="Dr. John">Dr. John</option>
          <option value="Dra. Smith">Dra. Smith</option>
        </select>
        <input type="text" placeholder="Pesquisar por cliente..." />
      </div>
      <div className="add-event">
        <input
          type="text"
          placeholder="Título"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
          showTimeSelect
          dateFormat="Pp"
        />
        <DatePicker
          selected={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })}
          showTimeSelect
          dateFormat="Pp"
        />
        <button onClick={handleAddEvent}>Adicionar Agendamento</button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.color },
        })}
        onSelectEvent={(event) => alert(`Detalhes do agendamento: ${event.title}`)}
      />
    </div>
  );
};

export default Agenda;
