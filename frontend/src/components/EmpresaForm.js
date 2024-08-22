import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import './EmpresaForm.css';

const EmpresaForm = () => {
  const [empresa, setEmpresa] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/empresas`, empresa, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setMessage('Empresa cadastrada com sucesso!');
        setMessageType('success');
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    } catch (err) {
        setMessage('Erro ao cadastrar empresa. Tente novamente mais tarde.');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
        console.error('Erro ao criar empresa:', err);
        setError('Erro ao cadastrar empresa. Tente novamente mais tarde.');
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
      <div className="cadastro-empresas-container">
        <h1>Cadastro das Empresas</h1>
        <form onSubmit={handleSubmit} className="cadastro-form">
          {message && (
            <div className={`floating-message ${messageType}`}>
              {message}
            </div>
          )}
          <label>Nome</label>
          <input type="text" name="nome" value={empresa.nome} onChange={handleChange} placeholder="Digite o nome da empresa" required />
          <label>Email</label>
          <input type="email" name="email" value={empresa.email} onChange={handleChange} placeholder="Digite o email" required />
          <label>Telefone</label>
          <input type="text" name="telefone" value={empresa.telefone} onChange={handleChange} placeholder="Digite o telefone"/>
          <label>Endereço</label>
          <input type="text" name="endereco" value={empresa.endereco} onChange={handleChange} placeholder="Digite o endereço"/>
          <div className="button-container">
            <button className="criar-button" type="submit" disabled={loading}>{loading ? 'Carregando...' : 'Criar Empresa'}</button>
            <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
          </div>
        </form>
        {message && <p className={`message ${messageType}`}>{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
};

export default EmpresaForm;
