import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CalendarioDisponibilidadesPage.css';
import axios from 'axios'; 
import { AuthContext } from '../AuthContext';

const DisponibilidadePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, agendamento, profissionais, servicos } = location.state;
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { empresa } = useContext(AuthContext);

  const handleVoltar = () => {
    navigate(-1);
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleSelecionarHorario = async (data, horario) => {
    console.log(`Horário selecionado: ${data} ${horario.inicio} - ${horario.fim}`);
    // Criando o objeto agendamento com os dados necessários
    const novoAgendamento = {
      empresa_id: `${empresa.id}`,
      cliente_id: agendamento.cliente_id,
      profissional_id: agendamento.profissional_id,
      servico_id: agendamento.servico_id,
      data_horario_agendamento: `${data} ${horario.inicio}`,
      status: 'agendado'
    };

    console.log('Antes do erro: ', novoAgendamento);

    try {
      const token = localStorage.getItem('token');
      console.log('Dentro do try: ', novoAgendamento);
      const response = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setMessage('Agendamento realizado com sucesso!');
      setMessageType('success');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message || 'Dados inválidos ou conflito de horário.');
        setMessageType('error');
      } else {
        console.error('Erro ao realizar agendamento:', error);
        setMessage('Erro ao realizar agendamento.');
        setMessageType('error');
      }
    }

  };

  return (
    <div className="disponibilidade-container">
      <h2>Disponibilidades</h2>
      {message && <div className={`floating-message ${messageType}`}>{message}</div>}
      <div className="disponibilidades-grid">
        {disponibilidades.map((disp, index) => (
          <div key={index} className="disponibilidade-item">
            <p>{disp.data} ({disp.diaSemana})</p>
            <p>{agendamento.profissional_id && profissionais.find(p => p.id === parseInt(agendamento.profissional_id))?.nome}</p>
            <p>{agendamento.servico_id && servicos.find(s => s.id === parseInt(agendamento.servico_id))?.nome}</p>
            <p>Duração: {agendamento.servico_id && servicos.find(s => s.id === parseInt(agendamento.servico_id))?.duracao} Minutos</p>
            {disp.horarios.map((horario, idx) => (
              <button 
                  key={idx} 
                  onClick={() => !horario.ocupado && handleSelecionarHorario(disp.data, horario)}
                  disabled={horario.ocupado}
                  className={horario.ocupado ? 'ocupado' : ''}
                  title={horario.ocupado ? `Ocupado pelo cliente: ${horario.cliente_nome} - Serviço: ${horario.servico_nome}` : ''}
                >
                  {`${horario.inicio} - ${horario.fim}`}
                </button>
              ))}
          </div>
        ))}
      </div>
      <button onClick={handleVoltar} className="voltar-button">Voltar</button>
    </div>
  );
};

export default DisponibilidadePage;
