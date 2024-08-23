import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfissionalForm.css';
import Sidebar from './Sidebar';

const ProfissionalForm = () => {
  const [profissional, setProfissional] = useState({
    empresa_id: '',
    nome: '',
    email: '',
    telefone: '',
    ativo: true
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/empresas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setEmpresas(response.data.empresas || response.data))
      .catch(() => setError('Não foi possível carregar a lista de empresas. Tente novamente mais tarde.'))
      .finally(() => setLoading(false));
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfissional(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/profissionais`, profissional, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profissional cadastrado com sucesso!');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage('Erro ao cadastrar profissional. Tente novamente mais tarde.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      setError('Erro ao cadastrar profissional. Tente novamente mais tarde.');
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
    <div className="cadastro-profissionais-container">
      <h1>Cadastro de Profissionais</h1>
      <form onSubmit={handleSubmit} className="cadastro-form">
        {message && (
          <div className={`floating-message ${messageType}`}>
            {message}
          </div>
        )}
        <label>Empresa</label>
        <select name="empresa_id" value={profissional.empresa_id} onChange={handleChange} required>
          <option value="">Selecione uma empresa</option>
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
          ))}
        </select>
        <label>Nome</label>
        <input type="text" name="nome" value={profissional.nome} onChange={handleChange} placeholder="Digite o nome do profissional" required />
        <label>Email</label>
        <input type="email" name="email" value={profissional.email} onChange={handleChange} placeholder="Digite o email do profissional" required />
        <label>Telefone</label>
        <input type="text" name="telefone" value={profissional.telefone} onChange={handleChange} placeholder="Digite o telefone do profissional" required />
        <label>Ativo</label>
        <select name="ativo" value={profissional.ativo} onChange={handleChange} required>
          <option value={true}>Ativo</option>
          <option value={false}>Inativo</option>
        </select>
        <div className="button-container">
          <button className="criar-button" disabled={loading}>{loading ? 'Carregando...' : 'Criar Profissional'}</button>
          <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        </div>
      </form>
      {error && <p className="message error">{error}</p>}
    </div>
    </div>
  );
};

export default ProfissionalForm;
