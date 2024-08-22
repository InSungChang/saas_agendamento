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
        const fetchUserAndCompany = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userResponse = await axios.get(`${API_BASE_URL}/usuario-logado`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUsuarioLogado(userResponse.data);

                    const empresaResponse = await axios.get(`${API_BASE_URL}/empresas/${userResponse.data.empresa_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setEmpresa(empresaResponse.data);
                } catch (error) {
                    console.error('Erro ao obter usuário logado ou dados da empresa:', error);
                    setError('Erro ao obter informações do usuário ou empresa.');
                }
            }
        };

        fetchUserAndCompany();
    }, [API_BASE_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/clientes`, cliente, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Cliente cadastrado com sucesso!');
            setMessageType('success');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setMessage('Erro ao cadastrar cliente. Tente novamente mais tarde.');
            setMessageType('error');
            setError('Erro ao cadastrar cliente. Tente novamente mais tarde.');
            console.error('Erro ao criar cliente:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => navigate('/dashboard');

    return (
        <div className="cadastro-clientes-container">
            <h1>Cadastro de Clientes</h1>
            <form onSubmit={handleSubmit} className="cadastro-form">
                {message && (
                    <div className={`floating-message ${messageType}`}>
                        {message}
                    </div>
                )}
                <label htmlFor="empresa">Empresa</label>
                <input 
                    id="empresa"
                    type="text" 
                    value={empresa ? empresa.nome : 'Carregando...'} 
                    disabled 
                />
                
                <label htmlFor="usuario">Usuário Logado</label>
                <input 
                    id="usuario"
                    type="text" 
                    value={usuarioLogado ? usuarioLogado.nome : 'Carregando...'} 
                    disabled 
                />
                
                <label htmlFor="nome">Nome</label>
                <input 
                    id="nome"
                    type="text" 
                    name="nome" 
                    value={cliente.nome} 
                    onChange={handleChange} 
                    placeholder="Digite o nome do cliente" 
                    required 
                />
                
                <label htmlFor="email">Email</label>
                <input 
                    id="email"
                    type="email" 
                    name="email" 
                    value={cliente.email} 
                    onChange={handleChange} 
                    placeholder="Digite o email" 
                    required 
                />
                
                <label htmlFor="telefone">Telefone</label>
                <input 
                    id="telefone"
                    type="text" 
                    name="telefone" 
                    value={cliente.telefone} 
                    onChange={handleChange} 
                    placeholder="Digite o telefone" 
                />
                
                <label htmlFor="endereco">Endereço</label>
                <input 
                    id="endereco"
                    type="text" 
                    name="endereco" 
                    value={cliente.endereco} 
                    onChange={handleChange} 
                    placeholder="Digite o endereço" 
                />
                
                <div className="button-container">
                    <button className="criar-button" type="submit" disabled={loading}>
                        {loading ? 'Carregando...' : 'Criar Cliente'}
                    </button>
                    <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>
                        Sair
                    </button>
                </div>
            </form>
            {error && <p className="message error">{error}</p>}
        </div>
    );
};

export default ClienteForm;