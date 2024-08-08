import React from 'react';

import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Bem-vindo ao Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/clientes">Cadastro de Clientes</Link></li>
          <li><Link to="/usuarios">Cadastro de Usuários</Link></li>          
          {/* Adicione outros links de navegação aqui */}
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
