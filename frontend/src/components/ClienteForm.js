import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ClienteForm.css';

const ClienteForm = () => {
    const [cliente, setCliente] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}/usuario-logado`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUsuarioLogado(response.data);
                // Buscar informações da empresa
                return axios.get(`${API_BASE_URL}/empresas/${response.data.empresa_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            })
            .then(empresaResponse => {
                setEmpresa(empresaResponse.data);
            })
            .catch(error => {
                console.error('Erro ao obter usuário logado ou dados da empresa:', error);
                setError('Erro ao obter informações do usuário ou empresa.');
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/clientes`, cliente, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            setMessage('Cliente cadastrado com sucesso!');
            setMessageType('success');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setMessage('Erro ao cadastrar cliente. Tente novamente mais tarde.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000);
            console.error('Erro ao criar cliente:', err);
            setError('Erro ao cadastrar cliente. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <form onSubmit={handleSubmit} className="cliente-form">
            {message && (
                <div className={`floating-message ${messageType}`}>
                    {message}
                </div>
            )}
            <div className="cadastro-clientes-container">
                <h1>Cadastro de Clientes</h1>
                <div className="cadastro-form">
                    <label>Empresa</label>
                    <input 
                        type="text" 
                        value={empresa ? empresa.nome : 'Carregando...'} 
                        disabled 
                    />
                    <label>Usuário Logado</label>
                    <input 
                        type="text" 
                        value={usuarioLogado ? usuarioLogado.nome : 'Carregando...'} 
                        disabled 
                    />
                    <label>Nome</label>
                    <input type="text" name="nome" value={cliente.nome} onChange={handleChange} placeholder="Digite o nome do cliente" required />
                    <label>Email</label>
                    <input type="email" name="email" value={cliente.email} onChange={handleChange} placeholder="Digite o email" required />
                    <label>Telefone</label>
                    <input type="text" name="telefone" value={cliente.telefone} onChange={handleChange} placeholder="Digite o telefone" />
                    <label>Endereço</label>
                    <input type="text" name="endereco" value={cliente.endereco} onChange={handleChange} placeholder="Digite o endereço" />
                </div>
                <button className="criar-button" disabled={loading}>{loading ? 'Carregando...' : 'Criar Cliente'}</button>
                <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
                {error && <p className="message error">{error}</p>}
            </div>
        </form>
    );
};

export default ClienteForm;
