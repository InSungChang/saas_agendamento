import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DisponibilidadesPageTodosProfissionais.css';
import Sidebar from './Sidebar';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const DisponibilidadePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, agendamento, profissionais } = location.state;
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
    console.log(`Horário selecionado: ${data} ${horario.horario} - ${horario.fim}`);
    if (horario.ocupado) {
      setMessage('Este horário já está ocupado.');
      setMessageType('error');
      return;
    }
    const novoAgendamento = {
      empresa_id: `${empresa.id}`,
      cliente_id: agendamento.cliente_id,
      profissional_id: agendamento.profissional_id,
      servico_id: horario.servico_id,
      data_horario_agendamento: `${data} ${horario.inicio}`,
      status: 'agendado'
    };

    console.log("novoAgendamento", novoAgendamento);

    try {
      const token = localStorage.getItem('token');
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
    <div className={`form-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <Sidebar onToggle={handleSidebarToggle} />
    <div className="disponibilidade-container">
      <h2>Disponibilidades-Todos os Serviços</h2>
      {message && <div className={`floating-message ${messageType}`}>{message}</div>}
      <div className="disponibilidades-grid">
        {disponibilidades.map((disp, index) => (
          <div key={index} className="disponibilidade-item">
            <p>{disp.data} ({disp.diaSemana})</p>            
            <p>{agendamento.profissional_id && profissionais.find(s => s.id === parseInt(agendamento.profissional_id))?.nome}</p>
            {disp.horarios.map((horario, idx) => {
                /* console.log(`Horário ${horario.horario} - Ocupado: ${horario.ocupado}`); */
                return (
                <button 
                  key={idx} 
                  onClick={() => handleSelecionarHorario(disp.data, horario)}
                  className={horario.ocupado ? "ocupado" : ""}
                  title={horario.ocupado ? `Ocupado pelo cliente: ${horario.cliente_nome} - Serviço: ${horario.servico_nome}` : ''}
                >
                  {`${horario.servico_nome} - Duração: ${horario.servico_duracao} - ${horario.inicio} - ${horario.fim}`}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleVoltar} className="voltar-button">Voltar</button>
    </div>
    </div>
  );
};

export default DisponibilidadePage;
