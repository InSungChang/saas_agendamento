import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ConsultarAlterarExcluir.css';
import Sidebar from './Sidebar';

const AlterarClienteForm = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [cliente, setCliente] = useState({
    empresa_id: '',
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Memoize fetchClientes
  const fetchClientes = useCallback((empresa_id) => {
    axios.get(`${API_BASE_URL}/clientes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      setClientes(response.data);
    })
    .catch(error => {
      console.error('Erro ao buscar clientes:', error);
      setMessage('Erro ao carregar lista de clientes.');
    });
  }, [API_BASE_URL]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/usuario-logado`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUsuarioLogado(response.data);
        return axios.get(`${API_BASE_URL}/empresas/${response.data.empresa_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(empresaResponse => {
        setEmpresa(empresaResponse.data);
        fetchClientes(empresaResponse.data.id); // Buscar clientes da empresa
      })
      .catch(error => {
        console.error('Erro ao obter usuário logado ou dados da empresa:', error);
        setMessage('Erro ao obter informações do usuário ou empresa.');
      });
    }
  }, [API_BASE_URL, fetchClientes]);

  useEffect(() => {
    if (usuarioLogado && empresa) {
      fetchClientes(empresa.id); // Buscar clientes quando usuarioLogado e empresa forem definidos
    }
  }, [usuarioLogado, empresa, fetchClientes]);

  useEffect(() => {
    if (clienteSelecionado) {
      axios.get(`${API_BASE_URL}/clientes/${clienteSelecionado}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        setCliente(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar dados do cliente:', error);
        setMessage('Erro ao carregar dados do cliente.');
      });
    } else {
      setCliente({
        empresa_id: '',
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      });
    }
  }, [clienteSelecionado, API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clienteAtualizado = {
      empresa_id: cliente.empresa_id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/clientes/${clienteSelecionado}`, clienteAtualizado, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data);
      setMessage('Cliente atualizado com sucesso!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      console.error('Erro ao atualizar cliente:', err);
      setMessage('Erro ao atualizar cliente. Tente novamente mais tarde.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/clientes/${clienteSelecionado}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Cliente excluído com sucesso!');
      setClienteSelecionado('');
      fetchClientes(usuarioLogado.empresa_id);
      setCliente({
        empresa_id: '',
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      });
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setMessage('Erro ao excluir cliente. Tente novamente mais tarde.');
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`form-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar onToggle={handleSidebarToggle} />
      <form className="consultar-container" onSubmit={handleSubmit}>
        {message && (
          <div className={`floating-message ${messageType}`}>
            {message}
          </div>
        )}
        <div className="alterar-container">
          <h1>Consultar / Alterar / Excluir Cliente</h1>
          <div className="search-container">
            <label>Pesquisar Cliente:</label>
            <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Buscar por nome" />
          </div>
          <div className="alterar-form">
            <label>Empresa</label>
            <input type="text" value={empresa ? empresa.nome : 'Carregando...'} disabled />
            <label>Usuário Logado</label>
            <input type="text" value={usuarioLogado ? usuarioLogado.nome : 'Carregando...'} disabled />
            <label>Selecionar Cliente</label>
            <select
              name="clienteSelecionado"
              value={clienteSelecionado || ''}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione um cliente</option>
              {filteredClientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {clienteSelecionado && (
              <>
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={cliente.nome}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={cliente.email}
                  onChange={handleChange}
                  required
                />
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={cliente.telefone}
                  onChange={handleChange}
                  required
                />
                <label>Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={cliente.endereco}
                  onChange={handleChange}
                  required
                />
              </>
            )}
          </div>
          <button type="submit" className="atualizar-button">Atualizar Cliente</button>
          <button type="button" className="delete-button" onClick={handleDelete}>Excluir Cliente</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>Sair</button>
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default AlterarClienteForm;
