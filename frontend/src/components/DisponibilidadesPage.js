import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DisponibilidadesPageTodosProfissionais.css';
import Sidebar from './Sidebar';
import axios from 'axios'; 
import { AuthContext } from '../AuthContext';

const DisponibilidadePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, agendamento, profissionais, servicos } = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { empresa } = useContext(AuthContext);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

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
      console.error('Erro ao realizar agendamento:', error);
      setMessage('Erro ao realizar agendamento.');
      setMessageType('error');
    }

  };

  return (
    <div className={`form-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <Sidebar onToggle={handleSidebarToggle} />
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
                onClick={() => handleSelecionarHorario(disp.data, horario)}
              >
                {`${horario.inicio} - ${horario.fim}`}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleVoltar} className="voltar-button">Voltar</button>
    </div>
    </div>
  );
};

export default DisponibilidadePage;
