import React, { useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate

const Dashboard = () => {

  const navigate = useNavigate();

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
    <div className="dashboard-container">
      <h1>Bem-vindo ao Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/clientes">Cadastro de Clientes</Link></li>
          <li><Link to="/consultarAlterarExcluirClientes">Consultar, Alterar e Excluir Clientes</Link></li>
          <li><Link to="/usuarios">Cadastro de Usuários</Link></li>
          <li><Link to="/consultarAlterarExcluirUsuarios">Consultar, Alterar e Excluir Usuários</Link></li>
          {/* Adicione outros links de navegação aqui */}
        </ul>
      </nav>
      <div className="dashboard-content">
        <p>Aqui você pode gerenciar suas informações e acessar outras funcionalidades.</p>
        {/* Adicione mais conteúdo conforme necessário */}
      </div>
      <button className="logout-button" onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Dashboard;
