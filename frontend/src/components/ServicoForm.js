import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import './ServicoForm.css';

const ServicoForm = () => {
  const [servico, setServico] = useState({
    empresa_id: '',
    nome: '',
    descricao: '',
    preco: '',
    duracao: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

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
    setServico(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePrecoChange = (values) => {
    const { floatValue } = values;
    setServico(prevState => ({ ...prevState, preco: floatValue }));
  };

  const handleDuracaoChange = (values) => {
    const { value } = values;
    setServico(prevState => ({ ...prevState, duracao: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/servicos`, servico, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Serviço cadastrado com sucesso!');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage('Erro ao cadastrar serviço. Tente novamente mais tarde.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      setError('Erro ao cadastrar serviço. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="cadastro-servicos-container">
      <h1>Cadastro de Serviços</h1>
      <form onSubmit={handleSubmit} className="cadastro-form">
        {message && (
          <div className={`floating-message ${messageType}`}>
            {message}
          </div>
        )}
        <label>Empresa</label>
        <select name="empresa_id" value={servico.empresa_id} onChange={handleChange} required>
          <option value="">Selecione uma empresa</option>
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
          ))}
        </select>
        <label>Nome</label>
        <input type="text" name="nome" value={servico.nome} onChange={handleChange} placeholder="Digite o nome do serviço" required />
        <label>Descrição</label>
        <textarea name="descricao" value={servico.descricao} onChange={handleChange} placeholder="Digite a descrição do serviço" />
        <label>Preço</label>
        <NumericFormat
          value={servico.preco}
          onValueChange={handlePrecoChange}
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          className="preco-input"
          placeholder="Digite o preço do serviço"
          required
        />
        <label>Duração (minutos)</label>
        <NumericFormat
          value={servico.duracao}
          onValueChange={handleDuracaoChange}
          thousandSeparator=""
          decimalScale={0}
          allowNegative={false}
          className="duracao-input"
          placeholder="Digite a duração do serviço em minutos"
          required
        />
        <div className="button-container">
          <button className="criar-button" disabled={loading}>{loading ? 'Carregando...' : 'Criar Serviço'}</button>
          <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        </div>
      </form>
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ServicoForm;
