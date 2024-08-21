import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Novo estado para controlar a exibição dos formulários
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, senha });
            if (typeof onLogin === 'function') {
                onLogin(response.data.token);
            } else {
                console.error('onLogin não é uma função. Certifique-se de que a prop onLogin está sendo passada corretamente.');
            }
            localStorage.setItem('token', response.data.token);
            setMessage('Login bem-sucedido!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Detalhes do erro:', error);
            if (error.response && error.response.data) {
                setMessage('Erro no login: ' + error.response.data);
            } else {
                setMessage('Erro no login: Ocorreu um erro desconhecido. Tente novamente mais tarde.');
            }
        }
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className={`container ${isRegistering ? 'active' : ''}`} id="container">
            <div className="form-container sign-up">
                <form>
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
                        <button className="hidden" onClick={toggleForm}>Para Logar</button>
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
