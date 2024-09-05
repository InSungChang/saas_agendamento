import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import axios from 'axios';
import './CalendarioAgendamento.css';

const CalendarioAgendamento = () => {
  const [eventos, setEventos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');

  useEffect(() => {
    carregarProfissionais();
    carregarEventos();
  }, []);

  const carregarProfissionais = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profissionais`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfissionais(response.data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    }
  };

  const carregarEventos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/agendamentos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const eventosFormatados = response.data.map(agendamento => ({
        id: agendamento.id,
        title: `${agendamento.cliente_nome} - ${agendamento.servico_nome}`,
        start: new Date(agendamento.data_horario_agendamento),
        end: new Date(new Date(agendamento.data_horario_agendamento).getTime() + agendamento.servico_duracao * 60000),
        color: obterCorProfissional(agendamento.profissional_id)
      }));
      console.log('Eventos formatados:', eventosFormatados);
      setEventos(eventosFormatados);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const obterCorProfissional = (profissionalId) => {
    const cores = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1'];
    return cores[profissionalId % cores.length];
  };

  const handleEventClick = (clickInfo) => {
    alert(`Detalhes do agendamento: ${clickInfo.event.title}`);
  };

  const handleDateSelect = (selectInfo) => {
    const title = prompt('Digite o nome do cliente e o serviço:');
    if (title) {
      const novoEvento = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };
      setEventos([...eventos, novoEvento]);
    }
    selectInfo.view.calendar.unselect();
  };

  const handleEventDrop = (dropInfo) => {
    console.log('Evento movido:', dropInfo.event);
  };

  const filtrarPorProfissional = (profissionalId) => {
    setProfissionalSelecionado(profissionalId);
  };

  return (
    <div className="calendario-container">
      <div className="filtro-profissionais">
        <select onChange={(e) => filtrarPorProfissional(e.target.value)} value={profissionalSelecionado}>
          <option value="">Todos os profissionais</option>
          {profissionais.map(prof => (
            <option key={prof.id} value={prof.id}>{prof.nome}</option>
          ))}
        </select>
      </div>
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={ptBrLocale}
          events={eventos}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          contentHeight="auto"
          stickyHeaderDates={true}
        />
      </div>
    </div>
  );
};

export default CalendarioAgendamento;