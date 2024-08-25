// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    // Definir a função `fetchUserAndCompany` usando `useCallback` para evitar redefinição desnecessária
    const fetchUserAndCompany = useCallback(async (token) => {
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
        }
    }, [API_BASE_URL]); // Incluindo API_BASE_URL como dependência

    const login = async (email, senha) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, senha });
            const token = response.data.token;
            localStorage.setItem('token', token);
            await fetchUserAndCompany(token); // Chama `fetchUserAndCompany` para atualizar usuário e empresa
        } catch (error) {
            console.error('Erro no login:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUsuarioLogado(null);
        setEmpresa(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserAndCompany(token); // Usa a função definida fora do `useEffect`
        }
    }, [fetchUserAndCompany]); // Incluindo a função como dependência

    return (
        <AuthContext.Provider value={{ usuarioLogado, empresa, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
