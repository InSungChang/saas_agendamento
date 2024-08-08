import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Bem-vindo ao Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/clientes">Cadastro de Clientes</Link></li>
          <li><Link to="/usuarios">Cadastro de Usuários</Link></li>          
          {/* Adicione outros links de navegação aqui */}
        </ul>
      </nav>
      <div className="dashboard-content">
        <p>Aqui você pode gerenciar suas informações e acessar outras funcionalidades.</p>
        {/* Adicione mais conteúdo conforme necessário */}
      </div>
    </div>
  );
};

export default Dashboard;
