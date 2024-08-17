// ClienteDropdown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClienteDropdown({ empresaId, onSelect }) {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        if (empresaId) {
            axios.get(`/api/clientes/${empresaId}`).then(response => {
                setClientes(response.data);
            });
        }
    }, [empresaId]);

    return (
        <select onChange={(e) => onSelect(e.target.value)} disabled={!empresaId}>
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
            ))}
        </select>
    );
}

export default ClienteDropdown;
