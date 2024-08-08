import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1>Bem-vindo ao Dashboard</h1>
      <nav>
        <ul>
          <li><a href="/usuarios">Cadastro de Usuários</a></li>
          <li><a href="/clientes">Gerenciamento de Clientes</a></li>
          <li><a href="/agendamentos">Agendamentos</a></li>
          <li><a href="/relatorios">Relatórios</a></li>
          <li><a href="/configuracoes">Configurações</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
