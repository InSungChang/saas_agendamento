import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, senha });
            localStorage.setItem('token', res.data.token);
            setMessage('Login bem-sucedido!');
        } catch (error) {
            setMessage('Erro no login: ' + error.response.data);
        }
    };

    return (
        <div>
            <h2>Login</h2>
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

export default Login;
