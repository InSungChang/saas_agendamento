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
  const [searchTerm, setSearchTerm] = useState('');

  const [empresas, setEmpresas] = useState([]); // Estado para armazenar a lista de empresas

  useEffect(() => {
    console.log('Buscando empresas...');
    axios.get('http://localhost:5000/api/empresas')
      .then(response => {
        console.log('Dados brutos da API:', response);
        const empresasData = response.data.empresas || response.data; 
        console.log('Empresas:', empresasData);
        setEmpresas(empresasData);
      })
      .catch(error => {
        console.error('Erro ao buscar empresas:', error);
        alert('Não foi possível carregar a lista de empresas. Verifique o console para mais detalhes.');
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
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
    } else {
      // Resetar dados do cliente se nenhum cliente estiver selecionado
      setCliente({
        empresa_id: '',
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      });
    }
  }, [clienteSelecionado]);

  const fetchClientes = () => {
    // Buscar todos os cliente
    axios.get('http://localhost:5000/api/clientes')
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        alert('Não foi possível carregar a lista de cliente. Verifique o console para mais detalhes.');
      });
  };

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
      const response = await axios.put(`http://localhost:5000/api/clientes/${clienteSelecionado}`, clienteAtualizado);
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${clienteSelecionado}`);
      setMessage('Cliente excluído com sucesso!');
      
      // Redefina o valor de `clienteSelecionado` antes de atualizar a lista de clientes
      setClienteSelecionado('');

      // Atualize a lista de clientes
      fetchClientes();

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
      <div className="alterar-container">
        <h1>Consultar / Alterar / Excluir Cliente</h1>
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
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {clienteSelecionado && (
            <>
              <label>ID da Empresa</label>
              < select name="empresa_id" value={cliente.empresa_id} onChange={handleChange} required>
                <option value="">Selecione uma empresa</option>
                {empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
                </option>
                ))}
              </select>
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
        <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
        {message && <p>{message}</p>}
      </div>
    </form>
  );
};

export default AlterarClienteForm;
