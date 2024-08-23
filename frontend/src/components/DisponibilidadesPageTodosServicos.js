import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const DisponibilidadePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, agendamento, profissionais } = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };
  const handleVoltar = () => {
    navigate(-1);
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
            <p>{agendamento.profissional_id && profissionais.find(s => s.id === parseInt(agendamento.profissional_id))?.nome}</p>
            {disp.horarios.map((horario, idx) => (
              <button 
                key={idx} 
                onClick={() => {
                  // Aqui você pode implementar a lógica para selecionar o horário
                  console.log(`Horário selecionado: ${disp.data} ${horario.inicio}`);
                }}
              >
                {`${horario.servico_nome} - Duração: ${horario.servico_duracao} - ${horario.inicio} - ${horario.fim}`}
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
