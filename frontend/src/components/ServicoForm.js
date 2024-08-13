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
    setServico({
      ...servico,
      [name]: value
    });
  };

  // função handlePrecoChange para lidar especificamente com as mudanças no campo de preço.
  const handlePrecoChange = (values) => {
    const { floatValue } = values;
    setServico({
      ...servico,
      preco: floatValue
    });
  };

  // função handleDuracaoChange específica para lidar com as mudanças no campo de duração.
  const handleDuracaoChange = (values) => {
    const { value } = values;
    setServico({
      ...servico,
      duracao: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // para converter o preço para o formato decimal antes de enviar para o servidor.
      const servicoToSubmit = {
        ...servico,
        preco: parseFloat(servico.preco).toFixed(2)
      };
      const response = await axios.post('http://localhost:5000/api/servicos', servicoToSubmit);
      console.log(response.data);
      setMessage('Serviço cadastrado com sucesso!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
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
    <form onSubmit={handleSubmit} className="servico-form">
      {message && (
        <div className={`floating-message ${messageType}`}>
          {message}
        </div>
      )}
      <div className="cadastro-servicos-container">
        <h1>Cadastro de Serviços</h1>
        <div className="cadastro-form">
          <label>ID da Empresa</label>
          <select name="empresa_id" value={servico.empresa_id} onChange={handleChange} required>
            <option value="">Selecione uma empresa</option>
            {empresas.map(empresa => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </select>
          <label>Nome</label>
          <input type="text" name="nome" value={servico.nome} onChange={handleChange} placeholder="Digite o nome do serviço" required />
          <label>Descrição</label>
          {/* <textarea name="descricao" value={servico.descricao} onChange={handleChange} placeholder="Digite a descrição do serviço" lang="pt-BR" spellcheck="true" autoComplete="off"/> */}
          <textarea name="descricao" value={servico.descricao} onChange={handleChange} placeholder="Digite a descrição do serviço" spellcheck="false"/>

          <label>Preço</label>
          {/* Substituímos o campo de input do preço por um componente NumericFormat, que formata automaticamente o valor como moeda brasileira. */}
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={handlePrecoChange}
            value={servico.preco}
            className="preco-input"
            placeholder="Digite o preço do serviço"
            required
          />

          {/* Substituímos o campo de input da duração por um componente NumericFormat, configurado para aceitar apenas números inteiros */}
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
          
        </div>
        <button className="criar-button" disabled={loading}>{loading ? 'Carregando...' : 'Criar Serviço'}</button>
        <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </form>
  );
};

export default ServicoForm;
