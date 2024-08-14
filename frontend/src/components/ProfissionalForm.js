import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfissionalForm.css';

const ProfissionalForm = () => {
  const [profissional, setProfissional] = useState({
    empresa_id: '',
    nome: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/empresas')
      .then(response => {
        console.log('Dados brutos da API:', response);
        const empresasData = response.data.empresas || response.data;
        console.log('Empresas:', empresasData);
        setEmpresas(empresasData);
      })
      .catch(error => {
        setError('Não foi possível carregar a lista de empresas. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfissional({
      ...profissional,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/profissionais', profissional);
      console.log(response.data);
      setMessage('Profissional cadastrado com sucesso!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
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
    <form onSubmit={handleSubmit} className="profissional-form">
      {message && (
        <div className={`floating-message ${messageType}`}>
          {message}
        </div>
      )}
      <div className="cadastro-profissionais-container">
        <h1>Cadastro de Profissionais</h1>
        <div className="cadastro-form">
          <label>Empresa</label>
          <select name="empresa_id" value={profissional.empresa_id} onChange={handleChange} required>
            <option value="">Selecione uma empresa</option>
            {empresas.map(empresa => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </select>
          <label>Nome</label>
          <input type="text" name="nome" value={profissional.nome} onChange={handleChange} placeholder="Digite o nome do profissional" required />
        </div>
        <button className="criar-button" disabled={loading}>{loading ? 'Carregando...' : 'Criar Profissional'}</button>
        <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </form>
  );
};

export default ProfissionalForm;
