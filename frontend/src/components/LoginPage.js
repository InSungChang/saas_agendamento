import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom'; // Adicionado para navegação

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Adicionado para navegação

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, senha });
            if (typeof onLogin === 'function') {
                onLogin(response.data.token); // Passa o token de autenticação para o componente pai, se definido
            } else {
                console.error('onLogin não é uma função. Certifique-se de que a prop onLogin está sendo passada corretamente.');
            }
            localStorage.setItem('token', response.data.token); // Salva o token no localStorage
            setMessage('Login bem-sucedido!');
            navigate('/dashboard'); // Redireciona para o dashboard após login bem-sucedido            
        } catch (error) {
            console.error('Detalhes do erro:', error); // Log detalhado do erro
            if (error.response && error.response.data) {
                setMessage('Erro no login: ' + error.response.data);
            } else {
                setMessage('Erro no login: Ocorreu um erro desconhecido. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </div>
                <button type="submit">Entrar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginPage;