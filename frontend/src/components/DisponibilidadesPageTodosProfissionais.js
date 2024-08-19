// DisponibilidadePage.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DisponibilidadePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { disponibilidades, agendamento, servicos } = location.state;

  const handleVoltar = () => {
    navigate(-1);
  };

  return (
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
                  // Aqui você pode implementar a lógica para selecionar o horário
                  console.log(`Horário selecionado: ${disp.data} ${horario.inicio}`);
                }}
              >
                {`${horario.profissional_nome} - ${horario.inicio} - ${horario.fim}`}
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
