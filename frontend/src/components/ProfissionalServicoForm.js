import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfissionalServicoForm.css';
import Sidebar from './Sidebar';

const ProfissionalServicoForm = () => {
  const [profissionalServico, setProfissionalServico] = useState({
    profissional_id: '',
    servico_id: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    Promise.all([
      axios.get(`${API_BASE_URL}/profissionais`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_BASE_URL}/servicos`, { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([profissionaisResponse, servicosResponse]) => {
        setProfissionais(profissionaisResponse.data);
        setServicos(servicosResponse.data);
      })
      .catch(error => {
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfissionalServico({
      ...profissionalServico,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/profissional-servicos`, profissionalServico, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Associação profissional-serviço criada com sucesso!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setMessage('Erro ao criar associação profissional-serviço. Tente novamente mais tarde.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      setError('Erro ao criar associação profissional-serviço. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`form-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <Sidebar onToggle={handleSidebarToggle} />
    <div className="cadastro-profissional-servico-container">
      <h1>Associar Profissional a Serviço</h1>
      <form onSubmit={handleSubmit} className="cadastro-form">
        {message && (
          <div className={`floating-message ${messageType}`}>
            {message}
          </div>
        )}
        <label>Profissional</label>
        <select name="profissional_id" value={profissionalServico.profissional_id} onChange={handleChange} required>
          <option value="">Selecione um profissional</option>
          {profissionais.map(profissional => (
            <option key={profissional.id} value={profissional.id}>
              {profissional.nome}
            </option>
          ))}
        </select>
        <label>Serviço</label>
        <select name="servico_id" value={profissionalServico.servico_id} onChange={handleChange} required>
          <option value="">Selecione um serviço</option>
          {servicos.map(servico => (
            <option key={servico.id} value={servico.id}>
              {servico.nome}
            </option>
          ))}
        </select>
        <div className="button-container">
          <button className="criar-button" disabled={loading}>{loading ? 'Carregando...' : 'Criar Associação'}</button>
          <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        </div>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
    </div>
  );
};

export default ProfissionalServicoForm;
