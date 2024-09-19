// TimeGrid.js
import React from 'react';

const TimeGrid = ({ disponibilidades }) => {
  const renderTimeSlots = (horarios) => {
    if (!horarios || horarios.length === 0) {
      return <div className="text-center text-gray-500">Nenhum horário disponível</div>;
    }

    return (
      <div className="grid grid-cols-12 gap-px mt-2">
        {horarios.map((horario) => (
          <div
            key={horario.inicio}
            className={`cursor-pointer border border-dotted border-gray-300 h-12 ${horario.ocupado ? 'bg-red-200' : 'bg-gray-100'} flex items-center justify-center`}
          >
            <span className="text-xs">{horario.inicio}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <span className="text-lg font-semibold">Horários Disponíveis</span>
      {disponibilidades.map((dia) => (
        <div key={dia.data}>
          <h3>{dia.data}</h3>
          {renderTimeSlots(dia.horarios)}
        </div>
      ))}
    </div>
  );
};

export default TimeGrid;
