import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DisponibilidadesPageTodosProfissionais.css';
import Sidebar from './Sidebar';

const DisponibilidadePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, agendamento, profissionais, servicos } = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  const handleSelecionarHorario = (data, horario) => {
    console.log(`Horário selecionado: ${data} ${horario.inicio} - ${horario.fim}`);
    // Aqui você pode implementar a lógica para selecionar o horário
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
