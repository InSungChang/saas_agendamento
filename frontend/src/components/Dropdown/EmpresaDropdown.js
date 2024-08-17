// EmpresaDropdown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmpresaDropdown({ onSelect }) {
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/empresas`).then(response => {
            setEmpresas(response.data);
        });
    }, []);

    return (
        <select onChange={(e) => onSelect(e.target.value)}>
            <option value="">Selecione uma empresa</option>
            {empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
            ))}
        </select>
    );
}

export default EmpresaDropdown;
