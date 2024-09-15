// Agendamento.js

import React, { useState } from 'react';
import './Agendamento.css';

const Agendamento = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // Pode ser 'day', 'week', ou 'month'

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleAgendamentoClick = (agendamentoId) => {
    // Função para lidar com o clique em um agendamento
    console.log(`Agendamento ${agendamentoId} clicado!`);
  };

  return (
    <div className="agendamento-container">
      <div className="sidebar">
        <div className="calendar">
          {/* Exibir calendário de navegação */}
          <h2>Calendário</h2>
          {/* Navegação por mês */}
          <div className="calendar-nav">
            <button onClick={() => handleDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>Anterior</button>
            <span>{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</span>
            <button onClick={() => handleDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>Próximo</button>
          </div>
        </div>
        <div className="professionals">
          <h3>Profissionais</h3>
          {/* Exibir lista de profissionais */}
          <ul>
            <li style={{ color: 'red' }}>Profissional 1</li>
            <li style={{ color: 'green' }}>Profissional 2</li>
            <li style={{ color: 'blue' }}>Profissional 3</li>
          </ul>
        </div>
      </div>
      <div className="main-content">
        <div className="toolbar">
          <button>Novo Agendamento</button>
          <button>Atualizar</button>
          <button onClick={() => handleDateChange(new Date())}>Hoje</button>
          <button onClick={() => handleDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>Anterior</button>
          <button onClick={() => handleDateChange(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>Próximo</button>
          <button onClick={() => handleViewChange('month')}>Mês</button>
          <button onClick={() => handleViewChange('week')}>Semana</button>
          <button onClick={() => handleViewChange('day')}>Dia</button>
          <input type="text" placeholder="Buscar paciente..." />
        </div>
        <div className="calendar-view">
          {/* Exibir a visualização do calendário (mês, semana ou dia) */}
          <h2>Visualização: {view}</h2>
          {/* Placeholder para agendamentos */}
          <div className="appointments">
            {/* Exemplo de um agendamento */}
            <div className="appointment" style={{ backgroundColor: 'red' }} onClick={() => handleAgendamentoClick(1)}>
              Agendamento 1 - Profissional 1
            </div>
            <div className="appointment" style={{ backgroundColor: 'green' }} onClick={() => handleAgendamentoClick(2)}>
              Agendamento 2 - Profissional 2
            </div>
            <div className="appointment" style={{ backgroundColor: 'blue' }} onClick={() => handleAgendamentoClick(3)}>
              Agendamento 3 - Profissional 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;
