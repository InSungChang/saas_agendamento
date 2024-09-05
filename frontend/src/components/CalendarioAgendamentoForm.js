import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CalendarioAgendamentoForm.css';
import { useNavigate } from 'react-router-dom';

const AgendamentoForm = () => {
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState({
    empresa_id: '', // Será preenchido automaticamente
    cliente_id: '',
    servico_id: '',
    profissional_id: '',
    data_horario_agendamento: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [diasExibicao, setDiasExibicao] = useState(7);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleExibirDisponibilidade = () => {
    navigate('/calendarioDisponibilidadesPage', { 
      state: { 
        disponibilidades, 
        agendamento, 
        profissionais, 
        servicos 
      } 
    });
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgendamento({ ...agendamento, [name]: value });
  
    if (name === 'servico_id') {
      carregarProfissionaisPorServico(value);
    }
  
    if (name === 'profissional_id') {
      carregarDisponibilidades(value);
    }
  
    // Validar campos obrigatórios
    if (!agendamento.cliente_id || !agendamento.servico_id || !agendamento.profissional_id || !agendamento.data_horario_agendamento) {
      setMessage('Todos os campos são obrigatórios');
      setMessageType('error');
    } else {
      setMessage('');
      setMessageType('');
    }
  }; 

  const carregarProfissionaisPorServico = (servicoId) => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/profissionais-por-servico/${servicoId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setProfissionais(response.data))
      .catch(error => console.error('Erro ao carregar profissionais por serviço:', error));
  };

  const carregarDisponibilidades = (profissionalId) => {
    const token = localStorage.getItem('token');
    const servicoDuracao = servicos.find(s => s.id === parseInt(agendamento.servico_id))?.duracao;
  
    axios.get(`${API_BASE_URL}/disponibilidades/profissional/${profissionalId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log('Dados recebidos:', response.data);
        const disponibilidadesFormatadas = formatarDisponibilidades(response.data, diasExibicao, servicoDuracao);
        console.log('Disponibilidades formatadas:', disponibilidadesFormatadas);
  
        // Filtrar disponibilidades baseado em agendamentos existentes
        axios.get(`${API_BASE_URL}/agendamentos/profissional/${profissionalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(agendamentoResponse => {
            console.log('Retorno do backend1: ', agendamentoResponse.data);
            const agendamentosExistentes = agendamentoResponse.data;
            const disponibilidadesFiltradas = filtrarHorarios(disponibilidadesFormatadas, agendamentosExistentes);
            setDisponibilidades(disponibilidadesFiltradas);
          })
          .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
            setDisponibilidades([]);
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
  
  const filtrarHorarios = (disponibilidades, agendamentos) => {
    return disponibilidades.map(dia => {
      const horariosFiltrados = dia.horarios.map(horario => {
        const horarioInicio = new Date(`${dia.data}T${horario.inicio}`);
        const horarioFim = new Date(`${dia.data}T${horario.fim}`);
  
        const agendamentoConflito = agendamentos.find(ag => {
          const agendamentoInicio = new Date(ag.data_horario_agendamento);
          const agendamentoFim = new Date(ag.data_horario_agendamento);
          agendamentoFim.setMinutes(agendamentoFim.getMinutes() + ag.servico_duracao);
  
          return (
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
  
  
  const formatarDisponibilidades = (disponibilidades, dias, servicoDuracao) => {
    if (!disponibilidades || disponibilidades.length === 0) {
      return [];
    }
  
    const hoje = new Date();
    const disponibilidadesFormatadas = [];
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  
    for (let i = 0; i < dias; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const diaSemana = diasSemana[data.getDay()];
  
      const disponibilidadesDoDia = disponibilidades.filter(d => d.dia_semana === diaSemana);
  
      if (disponibilidadesDoDia.length > 0) {
        const horariosDistribuidos = distribuirHorarios(disponibilidadesDoDia[0], servicoDuracao);
        
        disponibilidadesFormatadas.push({
          data: data.toISOString().split('T')[0],
          diaSemana: diaSemana,
          horarios: horariosDistribuidos
        });
      }
    }
  
    return disponibilidadesFormatadas;
  };
  
  const distribuirHorarios = (disponibilidade, servicoDuracao) => {
    const horarios = [];
    const inicio = new Date(`2000-01-01T${disponibilidade.hora_inicio}`);
    const fim = new Date(`2000-01-01T${disponibilidade.hora_fim}`);
  
    while (inicio < fim) {
      const horarioFim = new Date(inicio.getTime() + servicoDuracao * 60000);
      if (horarioFim <= fim) {
        horarios.push({
          inicio: inicio.toTimeString().slice(0, 5),
          fim: horarioFim.toTimeString().slice(0, 5)
        });
      }
      inicio.setTime(inicio.getTime() + servicoDuracao * 60000);
    }
  
    return horarios;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/agendamentos`, agendamento, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Agendamento realizado com sucesso!');
      setMessageType('success');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage(err.response.data.message || 'Dados inválidos ou conflito de horário.');
        setMessageType('error');  
      } else {
        setMessage('Erro ao realizar agendamento. Por favor, tente novamente.');
        setMessageType('error');
      }
    } finally {
    }
  };

  return (
    <div className="agendamento-container">    
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

          <label>Profissional</label>
          <select 
            name="profissional_id" 
            value={agendamento.profissional_id} 
            onChange={handleChange} 
            required
            disabled={!agendamento.servico_id}
          >
          <option value="">Selecione um profissional</option>
             {profissionais.map(profissional => (
             <option key={profissional.id} value={profissional.id}>{profissional.nome}</option>
             ))}
          </select>
          
          <div className="button-container">
            <button 
              type="button" 
              onClick={handleExibirDisponibilidade} 
              className="exibir-disponibilidade-button"
              disabled={!agendamento.profissional_id}
            >
              Exibir Disponibilidade
            </button>
          </div>

        </div>
  
      </form>
    </div>
  );
};

export default AgendamentoForm;