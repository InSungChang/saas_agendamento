import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DisponibilidadeForm.css';
import { useNavigate } from 'react-router-dom';

const DisponibilidadeForm = () => {
  const [profissionalId, setProfissionalId] = useState('');
  const [profissionais, setProfissionais] = useState([]);
  const [disponibilidade, setDisponibilidade] = useState({
    profissional_id: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fim: ''
  });
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/profissionais`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setProfissionais(response.data))
      .catch(error => {
        console.error('Erro ao carregar lista de profissionais.', error);
        setError('Erro ao carregar lista de profissionais.');
      });
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (profissionalId && token) {
      axios.get(`${API_BASE_URL}/disponibilidades/profissional/${profissionalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setDisponibilidades(response.data))
        .catch(error => {
          console.error('Erro ao carregar disponibilidades.', error);
          setError('Erro ao carregar disponibilidades.');
        });
    }
  }, [profissionalId, API_BASE_URL]);

  const handleProfissionalChange = (e) => {
    setProfissionalId(e.target.value);
    setDisponibilidade({ ...disponibilidade, profissional_id: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisponibilidade({
      ...disponibilidade,
      [name]: value
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
      await axios.post(`${API_BASE_URL}/disponibilidades`, disponibilidade, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Atualiza a lista de disponibilidades após a criação
      const response = await axios.get(`${API_BASE_URL}/disponibilidades/profissional/${profissionalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisponibilidades(response.data);
      setMessage('Disponibilidade cadastrada com sucesso!');
      setMessageType('success');
    } catch (err) {
      setMessage('Erro ao cadastrar disponibilidade.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/disponibilidades/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Atualiza a lista de disponibilidades após a exclusão
      const response = await axios.get(`${API_BASE_URL}/disponibilidades/profissional/${profissionalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisponibilidades(response.data);
    } catch (err) {
      setMessage('Erro ao excluir disponibilidade.');
      setMessageType('error');
    }
  };

  return (
    <div className="disponibilidade-container">
      {message && <div className={`floating-message ${messageType}`}>{message}</div>}
      <h1>Cadastro de disponibilidade</h1>
      <form onSubmit={handleSubmit} className="disponibilidade-form">
        <label>Profissional</label>
        <select name="profissional_id" value={profissionalId} onChange={handleProfissionalChange} required>
          <option value="">Selecione um profissional</option>
          {profissionais.map(profissional => (
            <option key={profissional.id} value={profissional.id}>
              {profissional.nome}
            </option>
          ))}
        </select>

        <label>Dia da Semana</label>
        <select name="dia_semana" value={disponibilidade.dia_semana} onChange={handleChange} required>
          <option value="">Selecione um dia</option>
          <option value="1">Segunda-feira</option>
          <option value="2">Terça-feira</option>
          <option value="3">Quarta-feira</option>
          <option value="4">Quinta-feira</option>
          <option value="5">Sexta-feira</option>
          <option value="6">Sábado</option>
          <option value="7">Domingo</option>
        </select>

        <label>Hora de Início</label>
        <input type="time" name="hora_inicio" value={disponibilidade.hora_inicio} onChange={handleChange} required />

        <label>Hora de Fim</label>
        <input type="time" name="hora_fim" value={disponibilidade.hora_fim} onChange={handleChange} required />

        <p>*** A LISTA DE HORÁRIO ESTÁ NO FIM DESSA PÁGINA ***</p>
        
        <div className="button-container">
          <button type="submit" className="criar-button" disabled={loading}>
            {loading ? 'Carregando...' : 'Criar Disponibilidade'}
          </button>
          <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        </div>  
      </form>

      <div className="disponibilidades-list">
        <h1>Disponibilidades</h1>
        <ul>
          {disponibilidades.map(d => (
            <li key={d.id}>
              <span>{`Dia: ${d.dia_semana}, Início: ${d.hora_inicio}, Fim: ${d.hora_fim}`}</span>
              <button onClick={() => handleDelete(d.id)} className="delete-button">Excluir</button>
            </li>
          ))}
        </ul>
      </div>
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default DisponibilidadeForm;
