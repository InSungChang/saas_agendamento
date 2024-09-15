import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AgendamentoTodosProfissionaisForm.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AgendamentoTodosProfissionaisForm = () => {
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState({
    empresa_id: '',
    cliente_id: '',
    servico_id: '',
    profissional_id: '',
    data_horario_agendamento: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [diasExibicao, setDiasExibicao] = useState(7);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgendamento({ ...agendamento, [name]: value });

    if (name === 'servico_id') {
      carregarProfissionaisPorServico(value);
      carregarDisponibilidades(value);
    }
  };

  const carregarProfissionaisPorServico = (servicoId) => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/web/profissionais-por-servico/${servicoId}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(response => {
        console.log('Profissionais carregados:', response.data);
        setProfissionais(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar profissionais por serviço:', error);
        setMessage('Erro ao carregar profissionais. Por favor, tente novamente.');
        setMessageType('error');
      });
  };

  const carregarDisponibilidades = (servicoId) => {
    const token = localStorage.getItem('token');
  
    if (!servicoId) {
      console.error('Serviço não selecionado');
      return;
    }
  
    axios.get(`${API_BASE_URL}/disponibilidades/servico/${servicoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log('Dados recebidos:', response.data);
        const disponibilidadesFormatadas = formatarDisponibilidades(response.data, diasExibicao);
        console.log('Disponibilidades formatadas:', disponibilidadesFormatadas);
        
        // Carregar agendamentos existentes por profissional
        console.log("Profissional ID: ", response.data[0]?.profissional_id);   
        axios.get(`${API_BASE_URL}/agendamentos/profissional/${response.data[0]?.profissional_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(agendamentoResponse => {
            console.log('Agendamentos existentes:', agendamentoResponse.data);
            const agendamentosExistentes = agendamentoResponse.data;
            const disponibilidadesFiltradas = filtrarHorarios(disponibilidadesFormatadas, agendamentosExistentes);
            setDisponibilidades(disponibilidadesFiltradas);
          })
          .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
            setMessage('Erro ao carregar agendamentos. Por favor, tente novamente.');
            setMessageType('error');
          });
      })
      .catch(error => {
        console.error('Erro ao carregar disponibilidades:', error);
        setDisponibilidades([]);
        setMessage('Erro ao carregar disponibilidades. Por favor, tente novamente.');
        setMessageType('error');
      });
  };
  
  const formatarDisponibilidades = (disponibilidades, dias) => {
    if (!disponibilidades || disponibilidades.length === 0) {
      return [];
    }
  
    console.log('Dados recebidos para formatar:', disponibilidades);
  
    const hoje = new Date();
    const disponibilidadesFormatadas = [];
  
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  
    for (let i = 0; i < dias; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const diaSemana = diasSemana[data.getDay()];
  
      const disponibilidadesDoDia = disponibilidades.filter(d => d.dia_semana === diaSemana);
  
      if (disponibilidadesDoDia.length > 0) {
        const horariosDisponiveis = [];
  
        disponibilidadesDoDia.forEach(d => {
          const [horaInicio, minutoInicio] = d.hora_inicio.split(':').map(Number);
          const [horaFim, minutoFim] = d.hora_fim.split(':').map(Number);
  
          let horarioAtual = new Date(data);
          horarioAtual.setHours(horaInicio, minutoInicio, 0);
  
          const horarioFim = new Date(data);
          horarioFim.setHours(horaFim, minutoFim, 0);
  
          while (horarioAtual.getTime() + d.servico_duracao * 60000 <= horarioFim.getTime()) {
            const horarioFim = new Date(horarioAtual.getTime() + d.servico_duracao * 60000);
            horariosDisponiveis.push({
              profissional_id: d.profissional_id,
              profissional_nome: d.profissional_nome,
              horario: horarioAtual.toTimeString().slice(0, 5),
              fim: horarioFim.toTimeString().slice(0, 5)
            });
            horarioAtual = new Date(horarioAtual.getTime() + d.servico_duracao * 60000);
          }
        });
  
        horariosDisponiveis.sort((a, b) => a.horario.localeCompare(b.horario));
  
        if (horariosDisponiveis.length > 0) {
          disponibilidadesFormatadas.push({
            data: data.toISOString().split('T')[0],
            diaSemana: diaSemana,
            horarios: horariosDisponiveis
          });
        }
      }
    }
  
    return disponibilidadesFormatadas;
  };

  const filtrarHorarios = (disponibilidades, agendamentos) => {
    return disponibilidades.map(dia => {
      const horariosFiltrados = dia.horarios.map(horario => {
        const horarioInicio = new Date(`${dia.data}T${horario.horario}`);
        const horarioFim = new Date(`${dia.data}T${horario.fim}`);
  
        const agendamentoConflito = agendamentos.find(ag => {
          const agendamentoInicio = new Date(ag.data_horario_agendamento);
          const agendamentoFim = new Date(ag.data_horario_agendamento);
          agendamentoFim.setMinutes(agendamentoFim.getMinutes() + ag.servico_duracao);
  
          return (
            ag.profissional_id === horario.profissional_id &&
            (agendamentoInicio < horarioFim) && 
            (agendamentoFim > horarioInicio)
          );
        });
  
        return {
          ...horario,
          ocupado: Boolean(agendamentoConflito),
          cliente_nome: agendamentoConflito ? agendamentoConflito.cliente_nome : null,
          servico_nome: agendamentoConflito ? agendamentoConflito.servico_nome : null
        };
      });
  
      return {
        ...dia,
        horarios: horariosFiltrados
      };
    });
  };

  const handleExibirDisponibilidade = () => {
    navigate('/disponibilidadesPageTodosProfissionais', { 
      state: { 
        disponibilidades, 
        agendamento, 
        profissionais, 
        servicos 
      } 
    });
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/agendamentos`, agendamento, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Agendamento realizado com sucesso!');
      setMessageType('success');
    } catch (err) {
      setMessage('Erro ao realizar agendamento.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className={`form-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar onToggle={handleSidebarToggle} />
      <div className="agendamento-container">      
        <h1>Agendamento - Filtro Por Serviço</h1>
        {message && <div className={`floating-message ${messageType}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="agendamento-form">        
          <div className="agendamento-form-header">          
            <label>Cliente</label>        
            <select name="cliente_id" value={agendamento.cliente_id} onChange={handleChange} required>
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
              ))}
            </select>

            <label>Serviço</label>
            <select name="servico_id" value={agendamento.servico_id} onChange={handleChange} required>
              <option value="">Selecione um serviço</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>{servico.nome}</option>
              ))}
            </select>

            <label>Dias de exibição</label>
            <select value={diasExibicao} onChange={(e) => setDiasExibicao(Number(e.target.value))}>
              <option value={7}>7 dias</option>
              <option value={14}>14 dias</option>
              <option value={21}>21 dias</option>
              <option value={30}>30 dias</option>
            </select>
              
            <div className="button-container">
            <button 
              type="button" 
              onClick={handleExibirDisponibilidade} 
              className="exibir-disponibilidade-button"
              disabled={!agendamento.servico_id}
            >
              Exibir Disponibilidade
            </button>

            <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendamentoTodosProfissionaisForm;