import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom'; // Adicionado useNavigate

const Dashboard = () => {

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  useEffect(() => {
    // Verifique se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirecione para login se não estiver autenticado
    }
  }, [navigate]);
  
  // Definindo a função handleLogout
  const handleLogout = () => {
    // Remova o token de autenticação ou quaisquer informações de sessão armazenadas
    localStorage.removeItem('token'); // Supondo que você esteja usando localStorage para o token

    // Redirecione para a página de login
    navigate('/login');
  };

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar onToggle={handleSidebarToggle}/>
      <div className="dashboard-content">
        <h1>Bem-vindo ao Dashboard</h1>
        <p>Aqui você pode gerenciar suas informações e acessar outras funcionalidades.</p>
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default Dashboard;
