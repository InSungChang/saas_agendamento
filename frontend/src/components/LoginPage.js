import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { AuthContext } from '../AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const { login } = useContext(AuthContext); // Use o contexto de autenticação
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, senha);
            setMessage('Login bem-sucedido!');
            navigate('/dashboard');
        } catch (error) {
            setMessage('Erro no login: Ocorreu um erro. Tente novamente.');
        }
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className={`container ${isRegistering ? 'active' : ''}`} id="container">
            <div className="form-container sign-up">
                <form className='form-acesso'>
                    <h1>Solicitar Acesso</h1>
                    <span>Via e-mail: changcriativo@gmail.com</span>
                    <span>WhatsApp: 41 99916-6567</span>
                </form>
            </div>
            <div className="form-container sign-in">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Senha:</label>
                        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    </div>
                    <button className="entrar-button" type="submit">Entrar</button>
                    {message && <p>{message}</p>}
                </form>
            </div>
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Bem vindo de volta!</h1>
                        <p>Insira seus dados pessoais para usar todos os recursos do site</p>
                        <button className="hidden" onClick={toggleForm}>Para Entrar</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Olá,</h1>
                        <p>Entre em contato para solicitar acesso de todas as funcionalidades do site</p>
                        <button className="hidden" onClick={toggleForm}>Solicitar acesso</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
