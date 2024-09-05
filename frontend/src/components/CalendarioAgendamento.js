import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import axios from 'axios';
import './CalendarioAgendamento.css';
import { useNavigate } from 'react-router-dom';
import CalendarioAgendamentoForm from './CalendarioAgendamentoForm'; // Importe o componente

const CalendarioAgendamento = () => {
  const [eventos, setEventos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [diasExibicao, setDiasExibicao] = useState(7);
  const [currentTimeEvent, setCurrentTimeEvent] = useState(null);
  const [horaInicial, setHoraInicial] = useState('08:00:00');
  const [horaFinal, setHoraFinal] = useState('19:00:00');
  const [showAgendamentoForm, setShowAgendamentoForm] = useState(false); // Estado para exibir o formulário
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
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
    const intervalId = setInterval(atualizarLinhaTempo, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const carregarEventos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/agendamentos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const eventosFormatados = formatarEventos(response.data);
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
      const eventosFormatados = formatarEventos(response.data);
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
      const duracaoServico = servico ? servico.duracao : 60;

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
  };

  const filtrarPorProfissional = (profissionalId) => {
    setProfissionalSelecionado(profissionalId);
    if (profissionalId) {
      carregarEventosPorProfissional(profissionalId);
    } else {
      carregarEventos();
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="calendario-container">
      <div className="lista-profissionais">
        <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        <button
          className="agendar-button"
          onClick={() => setShowAgendamentoForm(true)}
        >
          Agendar
        </button>
        {showAgendamentoForm && (
          <div className="agendamento-modal">
            <CalendarioAgendamentoForm />
            <button onClick={() => setShowAgendamentoForm(false)}>Fechar</button>
          </div>
        )}
        <div className="filtro-horario">
          <label>
            Horário Inicial:
            <input
              type="time"
              value={horaInicial}
              onChange={(e) => setHoraInicial(e.target.value)}
            />
          </label>
          <label>
            Horário Final:
            <input
              type="time"
              value={horaFinal}
              onChange={(e) => setHoraFinal(e.target.value)}
            />
          </label>
        </div>
        <div
          className="profissional-item"
          style={{ backgroundColor: '#000' }}
          onClick={() => filtrarPorProfissional('')}
        >
          Todos os Profissionais
        </div>
        {profissionais.map(prof => (
          <div
            key={prof.id}
            className="profissional-item"
            style={{ backgroundColor: prof.cor }}
            onClick={() => filtrarPorProfissional(prof.id)}
          >
            {prof.nome}
          </div>
        ))}
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
          slotMinTime={horaInicial}
          slotMaxTime={horaFinal}
          nowIndicator={true}
        />
      </div>
    </div>
  );
};

export default CalendarioAgendamento;
