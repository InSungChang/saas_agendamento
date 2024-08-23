import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DisponibilidadesPageTodosProfissionais.css';
import Sidebar from './Sidebar';

const DisponibilidadePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, agendamento, servicos } = location.state;

  const handleVoltar = () => {
    navigate(-1);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className={`form-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <Sidebar onToggle={handleSidebarToggle} />
    <div className="disponibilidade-container">
      <h2>Disponibilidades</h2>
      <div className="disponibilidades-grid">
        {disponibilidades.map((disp, index) => (
          <div key={index} className="disponibilidade-item">
            <p>{disp.data} ({disp.diaSemana})</p>            
            <p>{agendamento.servico_id && servicos.find(s => s.id === parseInt(agendamento.servico_id))?.nome}</p>
            <p>Duração: {agendamento.servico_id && servicos.find(s => s.id === parseInt(agendamento.servico_id))?.duracao} Minutos</p>
            {disp.horarios.map((horario, idx) => (
              <button 
                key={idx} 
                onClick={() => {
                  console.log(`Horário selecionado: ${disp.data} ${horario.horario}`);
                }}
              >
                {`${horario.profissional_nome} - ${horario.horario} - ${horario.fim}`}
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
