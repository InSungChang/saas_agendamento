// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
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
                }
            }
        };

        fetchUserAndCompany();
    }, [API_BASE_URL]);

    return (
        <AuthContext.Provider value={{ usuarioLogado, empresa }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
