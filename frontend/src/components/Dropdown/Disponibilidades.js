// Disponibilidades.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Disponibilidades({ profissionalId }) {
    const [disponibilidades, setDisponibilidades] = useState([]);

    useEffect(() => {
        if (profissionalId) {
            axios.get(`/api/disponibilidades/${profissionalId}`).then(response => {
                setDisponibilidades(response.data);
            });
        }
    }, [profissionalId]);

    return (
        <div>
            {disponibilidades.map(disponibilidade => (
                <div key={disponibilidade.id}>
                    <p>Data: {disponibilidade.data}</p>
                    <p>Hora: {disponibilidade.hora}</p>
                </div>
            ))}
        </div>
    );
}

export default Disponibilidades;
