import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AgendamentoModal.css';

const AgendamentoModal = ({ show, onClose, selectedDate }) => {
    const [clientes, setClientes] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [agendamento, setAgendamento] = useState({
        cliente_id: '',
        servico_id: '',
        profissional_id: '',
        data_horario_agendamento: selectedDate
    });
    
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}/clientes`, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setClientes(response.data))
                .catch(error => console.error('Erro ao carregar clientes:', error));

            axios.get(`${API_BASE_URL}/servicos`, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setServicos(response.data))
                .catch(error => console.error('Erro ao carregar serviços:', error));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgendamento({ ...agendamento, [name]: value });

        if (name === 'servico_id') {
            carregarProfissionaisPorServico(value);
        }

        if (name === 'profissional_id') {
            carregarDisponibilidades(value);
        }
    };

    const carregarProfissionaisPorServico = (servicoId) => {
        const token = localStorage.getItem('token');
        axios.get(`${API_BASE_URL}/web/profissionais-por-servico/${servicoId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setProfissionais(response.data))
            .catch(error => console.error('Erro ao carregar profissionais por serviço:', error));
    };

    const carregarDisponibilidades = (profissionalId) => {
        const token = localStorage.getItem('token');
        axios.get(`${API_BASE_URL}/web/disponibilidades/profissional/${profissionalId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setDisponibilidades(response.data))
            .catch(error => console.error('Erro ao carregar disponibilidades:', error));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/agendamentos`, agendamento, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Agendamento realizado com sucesso!');
            onClose();
        } catch (err) {
            console.error('Erro ao realizar agendamento:', err);
            alert('Erro ao realizar agendamento. Por favor, tente novamente.');
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>×</span>
                <form onSubmit={handleSubmit} className="agendamento-form">
                    <label>Cliente</label>
                    <select name="cliente_id" value={agendamento.cliente_id} onChange={handleChange} required>
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                        ))}
                    </select>
    
                    <label>Serviço</label>
                    <select name="servico_id" value={agendamento.servico_id} onChange={handleChange} required>
                        <option value="">Selecione um serviço</option>
                        {servicos.map(servico => (
                            <option key={servico.id} value={servico.id}>{servico.nome}</option>
                        ))}
                    </select>
    
                    <label>Profissional</label>
                    <select name="profissional_id" value={agendamento.profissional_id} onChange={handleChange} required>
                        <option value="">Selecione um profissional</option>
                        {profissionais.map(profissional => (
                            <option key={profissional.id} value={profissional.id}>{profissional.nome}</option>
                        ))}
                    </select>
    
                    <label>Data e Hora</label>
                    <input type="datetime-local" name="data_horario_agendamento" value={agendamento.data_horario_agendamento} onChange={handleChange} required />
    
                    <button type="submit" className="agendar-button">Agendar</button>
                    <button type="button" className="fechar-button" onClick={onClose}>Fechar</button>
                </form>
            </div>
        </div>
    );
        
};

export default AgendamentoModal;
