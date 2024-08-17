// AgendamentoForm.js
import React, { useState } from 'react';
import EmpresaDropdown from './EmpresaDropdown';
import ClienteDropdown from './ClienteDropdown';
import ProfissionalDropdown from './ProfissionalDropdown';
import ServicoDropdown from './ServicoDropdown';
import Disponibilidades from './Disponibilidades';

function AgendamentoForm() {
    const [empresaId, setEmpresaId] = useState(null);
    const [clienteId, setClienteId] = useState(null);
    const [profissionalId, setProfissionalId] = useState(null);
    const [servicoId, setServicoId] = useState(null);

    return (
        <div>
            <h2>Agendamento</h2>
            <EmpresaDropdown onSelect={setEmpresaId} />
            <ClienteDropdown empresaId={empresaId} onSelect={setClienteId} />
            <ServicoDropdown empresaId={empresaId} onSelect={setServicoId} />
            <ProfissionalDropdown empresaId={empresaId} onSelect={setProfissionalId} />
            <Disponibilidades profissionalId={profissionalId} />
            {/* Adicione mais lógica aqui para processar o agendamento */}
        </div>
    );
}

export default AgendamentoForm;
