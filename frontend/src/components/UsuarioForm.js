import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UsuarioForm.css';

const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    empresa_id: '',
    nome: '',
    email: '',
    senha: '',
    papel: 'funcionario'
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/empresas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const empresasData = response.data.empresas || response.data;
        setEmpresas(empresasData);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/usuarios`, usuario, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Usuário cadastrado com sucesso!');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      setMessage(err.response?.status === 409
        ? 'Este e-mail já está cadastrado. Por favor, use outro e-mail.'
        : 'Erro ao cadastrar usuário. Tente novamente mais tarde.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/dashboard');

  return (
    <div className="cadastro-usuarios-container">
      <h1>Cadastro de Usuários</h1>
      <form onSubmit={handleSubmit} className="cadastro-form">
        {message && (
          <div className={`floating-message ${messageType}`}>
            {message}
          </div>
        )}
        <label htmlFor="empresa_id">Empresa</label>
        <select
          id="empresa_id"
          name="empresa_id"
          value={usuario.empresa_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma empresa</option>
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nome}
            </option>
          ))}
        </select>

        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={usuario.nome}
          onChange={handleChange}
          placeholder="Digite o nome do usuário"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={usuario.email}
          onChange={handleChange}
          placeholder="Digite o email"
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={usuario.senha}
          onChange={handleChange}
          placeholder="Digite uma senha"
          required
        />

        <label htmlFor="papel">Papel</label>
        <select
          id="papel"
          name="papel"
          value={usuario.papel}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um papel</option>
          <option value="admin">Admin</option>
          <option value="funcionario">Funcionário</option>
        </select>

        <div className="button-container">
          <button className="criar-button" type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Criar Usuário'}
          </button>
          <button 
            className="sair-button" 
            type="button" 
            onClick={handleCancel}
            disabled={loading}
          >
            Sair
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;