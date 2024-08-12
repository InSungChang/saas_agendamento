import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ConsultarAlterarExcluir.css';

const AlterarEmpresaForm = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionado, setEmpresaSelecionado] = useState('');
  const [empresa, setEmpresa] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (empresaSelecionado) {
      // Buscar dados do empresa selecionado
      axios.get(`http://localhost:5000/api/empresas/${empresaSelecionado}`)
        .then(response => {
          setEmpresa(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar dados da empresa:', error);
        });
    } else {
      // Resetar dados do empresa se nenhum empresa estiver selecionado
      setEmpresa({
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      });
    }
  }, [empresaSelecionado]);

  const fetchEmpresas = () => {
    // Buscar todos os empresa
    axios.get('http://localhost:5000/api/empresas')
      .then(response => {
        setEmpresas(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar empresas:', error);
        alert('Não foi possível carregar a lista de empresa. Verifique o console para mais detalhes.');
      });
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

    // Crie um novo objeto sem o campo `senha`
    const empresaAtualizado = {
    nome: empresa.nome,
    email: empresa.email,
    telefone: empresa.telefone,
    endereco: empresa.endereco
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/empresas/${empresaSelecionado}`, empresaAtualizado);
      console.log(response.data);
      setMessage('Empresa atualizado com sucesso!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar empresa:', err);
      setMessage('Erro ao atualizar empresa. Tente novamente mais tarde.');
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
      await axios.delete(`http://localhost:5000/api/empresas/${empresaSelecionado}`);
      setMessage('Empresa excluído com sucesso!');
      
      // Redefina o valor de `empresaSelecionado` antes de atualizar a lista de empresas
      setEmpresaSelecionado('');

      // Atualize a lista de empresas
      fetchEmpresas();

      setEmpresa({
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      });

      setTimeout(() => {
        setMessage('');
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao excluir empresa:', err);
      setMessage('Erro ao excluir empresa. Tente novamente mais tarde.');
    }
  };

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="alterar-container">
        <h1>Consultar / Alterar / Excluir Empresa</h1>
        <div className="search-container">
          <label>Pesquisar Empresa:</label>
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Buscar por nome" />
        </div>
        <div className="alterar-form">
          <label>Selecionar Empresa</label>
          <select
            name="empresaSelecionado"
            value={empresaSelecionado || ''}
            onChange={(e) => setEmpresaSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um empresa</option>
            {filteredEmpresas.map(empresa => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </select>
          {empresaSelecionado && (
            <>
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={empresa.nome}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={empresa.email}
                onChange={handleChange}
                required
              />
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                value={empresa.telefone}
                onChange={handleChange}
                required
              />
              <label>Endereço</label>
              <input
                type="text"
                name="endereco"
                value={empresa.endereco}
                onChange={handleChange}
                required
              />
            </>
          )}
        </div>
        <button type="submit" className="atualizar-button">Atualizar Empresa</button>
        <button type="button" className="delete-button" onClick={handleDelete}>Excluir Empresa</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
        {message && <p>{message}</p>}
      </div>
    </form>
  );
};

export default AlterarEmpresaForm;
