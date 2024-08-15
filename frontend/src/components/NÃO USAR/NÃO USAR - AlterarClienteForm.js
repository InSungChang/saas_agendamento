import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AlterarClienteForm.css'; 

const AlterarClienteForm = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar todos os clientes
    axios.get('http://localhost:5000/api/clientes')
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        alert('Não foi possível carregar a lista de clientes. Verifique o console para mais detalhes.');
      });
  }, []);

  useEffect(() => {
    if (clienteSelecionado) {
      // Buscar dados do cliente selecionado
      axios.get(`http://localhost:5000/api/clientes/${clienteSelecionado}`)
        .then(response => {
          setCliente(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do cliente:', error);
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
    try {
      const response = await axios.put(`http://localhost:5000/api/clientes/${clienteSelecionado}`, cliente);
      console.log(response.data);
      setMessage('Cliente atualizado com sucesso!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
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

  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      
        <form onSubmit={handleSubmit}>
              <div className="alterar-cliente-container">

        <h1>Alterar Cliente</h1>
        <div className="search-container">
          <label>Pesquisar Cliente:</label>
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Buscar por nome" />
        </div>
        <div className="alterar-form">
          <label>Selecionar Cliente</label>
          <select 
            name="clienteSelecionado" 
            value={clienteSelecionado || ''} 
            onChange={(e) => setClienteSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um cliente</option>
            {filteredClientes.map(cliente => (
              <option key={cliente.cliente_id} value={cliente.cliente_id}>
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
        <button type="submit">Atualizar Cliente</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
        {message && <p>{message}</p>}
        </div>
      </form>
  );
};

export default AlterarClienteForm;