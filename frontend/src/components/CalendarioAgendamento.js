// CalendarioAgendamento.js
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
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [diasExibicao, setDiasExibicao] = useState(7);
  const [currentTimeEvent, setCurrentTimeEvent] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Carregar clientes, serviços e profissionais
      axios.get(`${API_BASE_URL}/clientes`, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setClientes(response.data))
        .catch(error => console.error('Erro ao carregar clientes:', error));

      axios.get(`${API_BASE_URL}/servicos`, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setServicos(response.data))
        .catch(error => console.error('Erro ao carregar serviços:', error));

      axios.get(`${API_BASE_URL}/profissionais`, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setProfissionais(response.data))
        .catch(error => console.error('Erro ao carregar profissionais:', error));
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (clientes.length > 0 && servicos.length > 0 && profissionais.length > 0) {
      carregarEventos();
    }
  }, [clientes, servicos, profissionais]);

  useEffect(() => {
    const atualizarLinhaTempo = () => {
      const now = new Date();
      setCurrentTimeEvent({
        id: 'current-time',
        title: '',
        start: now,
        end: now,
        display: 'background',
        backgroundColor: 'red',
        borderColor: 'red'
      });
    };

    atualizarLinhaTempo();
    const intervalId = setInterval(atualizarLinhaTempo, 60000); // Atualiza a cada minuto

    return () => clearInterval(intervalId);
  }, []);

  const carregarEventos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/agendamentos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Dados recebidos dos agendamentos:', response.data);
      const eventosFormatados = formatarEventos(response.data);
      console.log('Eventos formatados:', eventosFormatados);
      setEventos(eventosFormatados);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const carregarEventosPorProfissional = async (profissionalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/agendamentos/profissional/${profissionalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Dados recebidos dos agendamentos do profissional:', response.data);
      const eventosFormatados = formatarEventos(response.data);
      console.log('Eventos formatados do profissional:', eventosFormatados);
      setEventos(eventosFormatados);
    } catch (error) {
      console.error('Erro ao carregar agendamentos do profissional:', error);
    }
  };

  const formatarEventos = (agendamentos) => {
    if (clientes.length === 0 || servicos.length === 0 || profissionais.length === 0) {
      return [];
    }

    return agendamentos.map(agendamento => {
      const cliente = clientes.find(c => c.id === agendamento.cliente_id);
      const servico = servicos.find(s => s.id === agendamento.servico_id);
      const profissional = profissionais.find(p => p.id === agendamento.profissional_id);
      const duracaoServico = servico ? servico.duracao : 60; // Duração padrão de 60 minutos se não encontrar o serviço

      const dataInicio = new Date(agendamento.data_horario_agendamento);
      const dataFim = new Date(dataInicio.getTime() + duracaoServico * 60000);

      return {
        id: agendamento.id,
        title: `${cliente ? cliente.nome : 'Cliente'} - ${servico ? servico.nome : 'Serviço'}`,
        start: dataInicio,
        end: dataFim,
        color: profissional ? profissional.cor : obterCorProfissional(agendamento.profissional_id)
      };
    });
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
    // Aqui você pode implementar a lógica para atualizar o agendamento no backend
  };

  const filtrarPorProfissional = (profissionalId) => {
    setProfissionalSelecionado(profissionalId);
    if (profissionalId) {
      carregarEventosPorProfissional(profissionalId);
    } else {
      carregarEventos();
    }
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
          events={[...eventos, currentTimeEvent].filter(event => event !== null)}
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
