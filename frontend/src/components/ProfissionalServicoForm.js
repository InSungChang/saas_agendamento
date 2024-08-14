import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfissionalServicoForm.css';

const ProfissionalServicoForm = () => {
  const [profissionalServico, setProfissionalServico] = useState({
    profissional_id: '',
    servico_id: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:5000/api/profissionais'),
      axios.get('http://localhost:5000/api/servicos')
    ])
      .then(([profissionaisResponse, servicosResponse]) => {
        console.log(profissionaisResponse.data);
        console.log(servicosResponse.data);
        setProfissionais(profissionaisResponse.data);
        setServicos(servicosResponse.data);
      })
      .catch(error => {
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfissionalServico({
      ...profissionalServico,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/profissional-servicos', profissionalServico);
      console.log(response.data);
      setMessage('Associação profissional-serviço criada com sucesso!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setMessage('Erro ao criar associação profissional-serviço. Tente novamente mais tarde.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      setError('Erro ao criar associação profissional-serviço. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="profissional-servico-form">
      {message && (
        <div className={`floating-message ${messageType}`}>
          {message}
        </div>
      )}
      <div className="cadastro-profissional-servico-container">
        <h1>Associar Profissional a Serviço</h1>
        <div className="cadastro-form">
          <label>Profissional</label>
          <select name="profissional_id" value={profissionalServico.profissional_id} onChange={handleChange} required>
            <option value="">Selecione um profissional</option>
            {profissionais.map(profissional => (
              <option key={profissional.id} value={profissional.id}>
                {profissional.nome}
              </option>
            ))}
          </select>
          <label>Serviço</label>
          <select name="servico_id" value={profissionalServico.servico_id} onChange={handleChange} required>
            <option value="">Selecione um serviço</option>
            {servicos.map(servico => (
              <option key={servico.id} value={servico.id}>
                {servico.nome}
              </option>
            ))}
          </select>
        </div>
        <button className="criar-button" disabled={loading}>{loading ? 'Carregando...' : 'Criar Associação'}</button>
        <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </form>
  );
};

export default ProfissionalServicoForm;
