import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ConsultarAlterarExcluir.css';

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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.get('http://localhost:5000/api/usuario-logado', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setUsuarioLogado(response.data);
            // Buscar informações da empresa
            return axios.get(`http://localhost:5000/api/empresas/${response.data.empresa_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        })
        .then(empresaResponse => {
            setEmpresa(empresaResponse.data);
            fetchClientes(empresaResponse.data.empresa_id); // Buscar clientes da empresa
        })
        .catch(error => {
            console.error('Erro ao obter usuário logado ou dados da empresa:', error);
            setMessage('Erro ao obter informações do usuário ou empresaxxx.');
        });
    }
  }, []);

  const fetchClientes = (empresa_id) => {
    axios.get(`http://localhost:5000/api/clientes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
        setClientes(response.data);
    })
    .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        setMessage('Erro ao carregar lista de clientes.');
    });
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (clienteSelecionado) {
        axios.get(`http://localhost:5000/api/clientes/${clienteSelecionado}`, {
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
  }, [clienteSelecionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crie um novo objeto sem o campo `senha`
    const clienteAtualizado = {
    empresa_id: cliente.empresa_id,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    endereco: cliente.endereco
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/clientes/${clienteSelecionado}`, clienteAtualizado, {
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
      await axios.delete(`http://localhost:5000/api/clientes/${clienteSelecionado}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Cliente excluído com sucesso!');
      
      // Redefina o valor de `clienteSelecionado` antes de atualizar a lista de clientes
      setClienteSelecionado('');

      // Atualize a lista de clientes
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
    <form onSubmit={handleSubmit}>
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
  );
};

export default AlterarClienteForm;
