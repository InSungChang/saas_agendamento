import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DisponibilidadesPage.css';
import { useNavigate } from 'react-router-dom';

const DisponibilidadesPage = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [diasExibicao, setDiasExibicao] = useState(7);
  const [selectedProfissional, setSelectedProfissional] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/profissionais`, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setProfissionais(response.data))
        .catch(error => console.error('Erro ao carregar profissionais:', error));
    }
  }, [API_BASE_URL]);

  const carregarDisponibilidades = (profissionalId) => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/disponibilidades/profissional/${profissionalId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const disponibilidadesFormatadas = formatarDisponibilidades(response.data, diasExibicao);
        setDisponibilidades(disponibilidadesFormatadas);
      })
      .catch(error => {
        console.error('Erro ao carregar disponibilidades:', error);
        setDisponibilidades([]);
      });
  };

  const formatarDisponibilidades = (disponibilidades, dias) => {
    if (!disponibilidades || disponibilidades.length === 0) {
      return [];
    }

    const hoje = new Date();
    const disponibilidadesFormatadas = [];
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    for (let i = 0; i < dias; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const diaSemana = diasSemana[data.getDay()];

      const disponibilidadesDoDia = disponibilidades.filter(d => d.dia_semana === diaSemana);

      if (disponibilidadesDoDia.length > 0) {
        disponibilidadesFormatadas.push({
          data: data.toISOString().split('T')[0],
          diaSemana: diaSemana,
          horarios: disponibilidadesDoDia.map(d => ({
            inicio: d.hora_inicio,
            fim: d.hora_fim
          }))
        });
      }
    }

    return disponibilidadesFormatadas;
  };

  const handleProfissionalChange = (e) => {
    setSelectedProfissional(e.target.value);
    carregarDisponibilidades(e.target.value);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="disponibilidades-page-container">
      <h2>Disponibilidades</h2>

      <div className="disponibilidades-form">
        <label>Profissional</label>
        <select value={selectedProfissional} onChange={handleProfissionalChange}>
          <option value="">Selecione um profissional</option>
          {profissionais.map(profissional => (
            <option key={profissional.id} value={profissional.id}>{profissional.nome}</option>
          ))}
        </select>

        <label>Dias de exibição</label>
        <select value={diasExibicao} onChange={(e) => setDiasExibicao(Number(e.target.value))}>
          <option value={7}>7 dias</option>
          <option value={14}>14 dias</option>
          <option value={21}>21 dias</option>
          <option value={30}>30 dias</option>
        </select>
      </div>

      <div className="disponibilidades-grid">
        {disponibilidades.map((disp, index) => (
          <div key={index} className="disponibilidade-item">
            <p>{disp.data} ({disp.diaSemana})</p>
            {disp.horarios.map((horario, idx) => (
              <button key={idx}>
                {`${horario.inicio} - ${horario.fim}`}
              </button>
            ))}
          </div>
        ))}
      </div>

      <button onClick={handleBackToDashboard} className="back-button">Voltar ao Dashboard</button>
    </div>
  );
};

export default DisponibilidadesPage;
