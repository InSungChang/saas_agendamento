import React, { useState, useEffect, useContext, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import axios from 'axios';
import './CalendarioAgendamento.css';
import { useNavigate } from 'react-router-dom';
import CalendarioAgendamentoForm from './CalendarioAgendamentoForm';
import { AuthContext } from '../AuthContext'; // Importe o AuthContext
import useInterval from './useInterval'; // Certifique-se de ter um hook useInterval implementado
import AgendamentoModal from './AgendamentoModal';

const CalendarioAgendamento = () => {
  const [eventos, setEventos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentTimeEvent, setCurrentTimeEvent] = useState(null);
  const [horaInicial, setHoraInicial] = useState('08:00:00');
  const [horaFinal, setHoraFinal] = useState('19:00:00');
  const [showAgendamentoForm, setShowAgendamentoForm] = useState(false);
  const [showAgendamentoModal, setShowAgendamentoModal] = useState(false);
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showConfirmacaoCancelamento, setShowConfirmacaoCancelamento] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Obter usuário logado e empresa do AuthContext
  const { usuarioLogado } = useContext(AuthContext); // Use o AuthContext para acessar os dados do usuário

  const formatarEventos = useCallback((agendamentos) => {
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
        color: profissional ? profissional.cor : obterCorProfissional(agendamento.profissional_id),
        extendedProps: {
          cliente_id: agendamento.cliente_id,  
          servico_id: agendamento.servico_id,  
          profissional_id: agendamento.profissional_id,  
        },
      };
    });
  }, [clientes, servicos, profissionais]);

  const carregarEventos = useCallback(async () => {
    console.log("Atualizando!!!");
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
  }, [API_BASE_URL, formatarEventos]);

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
  }, [clientes, servicos, profissionais, carregarEventos]);

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

  const handleEventClick = (clickInfo) => {
    const evento = clickInfo.event;
    const cliente = clientes.find(c => c.id === evento.extendedProps.cliente_id);
    const servico = servicos.find(s => s.id === evento.extendedProps.servico_id);
    const profissional = profissionais.find(p => p.id === evento.extendedProps.profissional_id);
    const dataInicio = new Date(evento.start);
    const dataFim = new Date(evento.end);

    setEventoSelecionado({
      id: evento.id,
      title: evento.title,
      cliente: cliente ? cliente.nome : 'Cliente',
      servico: servico ? servico.nome : 'Serviço',
      profissional: profissional ? profissional.nome : 'Profissional',
      dataInicio: dataInicio.toLocaleString(),
      dataFim: dataFim.toLocaleString(),
    });

    setShowEventoModal(true);
  };

  const handleCloseEventoModal = () => {
    setShowEventoModal(false);
    setShowConfirmacaoCancelamento(false);
  };

  const handleCancelarAgendamento = () => {
    setShowConfirmacaoCancelamento(true);
  };

  const confirmarCancelamento = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/cancelamentos`, {
        agendamento_id: eventoSelecionado.id,
        usuario_id: usuarioLogado?.id // Usa o usuarioLogado.id do AuthContext
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remover o evento cancelado da lista de eventos
      setEventos(eventos.filter(evento => evento.id !== eventoSelecionado.id));

      handleCloseEventoModal();
      carregarEventos(); // Recarregar eventos para atualizar a visualização
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Ocorreu um erro ao cancelar o agendamento. Por favor, tente novamente.');
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

  const obterCorProfissional = (profissionalId) => {
    const cores = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1'];
    return cores[profissionalId % cores.length];
  };

  const handleDateSelect = (selectInfo) => {
    if (selectInfo.view.type === 'timeGridDay') {
      setSelectedDate(selectInfo.startStr);
      setShowAgendamentoModal(true);
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

  useInterval(() => {
    carregarEventos();
  }, 180000); // Atualiza a cada 3 minutos (300000 ms)

  return (
    <div className="calendario-container">
      <div className="lista-profissionais">
        <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        <button className="atualizar-button" onClick={carregarEventos} disabled={loading}>Atualizar Dados</button>
        <button className="agendar-button" onClick={() => setShowAgendamentoForm(true)}>Agendar</button>
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
      {showAgendamentoModal && (
        <AgendamentoModal
          show={showAgendamentoModal}
          onClose={() => setShowAgendamentoModal(false)}
          selectedDate={selectedDate}
        />
      )}
      {showEventoModal && (
        <div className="evento-modal">
            <h2>Detalhes do Agendamento</h2>
            <p><strong>Cliente:</strong> {eventoSelecionado.cliente}</p>
            <p><strong>Serviço:</strong> {eventoSelecionado.servico}</p>
            <p><strong>Profissional:</strong> {eventoSelecionado.profissional}</p>
            <p><strong>Início:</strong> {eventoSelecionado.dataInicio}</p>
            <p><strong>Fim:</strong> {eventoSelecionado.dataFim}</p>
            <button onClick={handleCloseEventoModal} className='fechar-button'>Fechar</button>
            <button onClick={handleCancelarAgendamento} className="cancelar-button">Cancelar Agendamento</button>
            {showConfirmacaoCancelamento && (
              <div className="confirmacao-cancelamento">
                <p>Deseja cancelar este agendamento?</p>
                <button onClick={confirmarCancelamento} className="cancelar-button">Sim</button>
                <button onClick={() => setShowConfirmacaoCancelamento(false)} className="cancelar-button">Não</button>
              </div>
            )}
        </div>        
      )}         
    </div>
  );
};

export default CalendarioAgendamento;