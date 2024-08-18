import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AgendamentoForm.css';
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
  const [loading, setLoading] = useState(false);
  const [diasExibicao, setDiasExibicao] = useState(7);
  /* const navigate = useNavigate(); */

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgendamento({ ...agendamento, [name]: value });

    if (name === 'servico_id') {
      carregarProfissionaisPorServico(value);
    }

    if (name === 'profissional_id') {
      carregarDisponibilidades(value);
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
    /* const dataInicio = new Date().toISOString().split('T')[0];
    const dataFim = new Date(Date.now() + diasExibicao * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; */

    axios.get(`${API_BASE_URL}/disponibilidades/profissional/${profissionalId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log('Dados recebidos:', response.data);
        const disponibilidadesFormatadas = formatarDisponibilidades(response.data, diasExibicao);
        console.log('Disponibilidades formatadas:', disponibilidadesFormatadas);
        setDisponibilidades(disponibilidadesFormatadas);
      })
      .catch(error => {
        console.error('Erro ao carregar disponibilidades:', error);
        setDisponibilidades([]);
      });
  };

  const formatarDisponibilidades = (disponibilidades, dias) => {
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
        disponibilidadesFormatadas.push({
          data: data.toISOString().split('T')[0],
          diaSemana: diaSemana,
          horarios: disponibilidadesDoDia.map(d => ({
            inicio: d.hora_inicio,
            fim: d.hora_fim
          }))
        });
      }
    }
  
    return disponibilidadesFormatadas;
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
      </div>
     
      <div className="disponibilidades-grid">
        {disponibilidades.map((disp, index) => (
          <div key={index} className="disponibilidade-item">
            <p>{disp.data} ({disp.diaSemana})</p>
            <p>{agendamento.profissional_id && profissionais.find(p => p.id === parseInt(agendamento.profissional_id))?.nome}</p>
            <p>{agendamento.servico_id && servicos.find(s => s.id === parseInt(agendamento.servico_id))?.nome}</p>
            {disp.horarios.map((horario, idx) => (
              <button 
                key={idx} 
                onClick={() => setAgendamento({...agendamento, data_horario_agendamento: `${disp.data} ${horario.inicio}`})}
              >
                {`${horario.inicio} - ${horario.fim}`}
              </button>
            ))}
          </div>
        ))}
      </div>
      
{/*         <button type="submit" className="agendar-button" disabled={loading}>
          {loading ? 'Agendando...' : 'Agendar'}
        </button>
 */}        
        <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
      </form>
    </div>
  );
};

export default AgendamentoForm;