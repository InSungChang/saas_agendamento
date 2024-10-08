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
          <li><Link to="/empresas">Cadastro das Empresas</Link></li>
          <li><Link to="/consultarAlterarExcluirEmpresas">Consultar, Alterar e Excluir Empresas</Link></li>
          <li><Link to="/usuarios">Cadastro de Usuários</Link></li>
          <li><Link to="/consultarAlterarExcluirUsuarios">Consultar, Alterar e Excluir Usuários</Link></li>
          <li><Link to="/clientes">Cadastro de Clientes</Link></li>
          <li><Link to="/consultarAlterarExcluirClientes">Consultar, Alterar e Excluir Clientes</Link></li>
          <li><Link to="/servicos">Cadastro de Serviços</Link></li>
          <li><Link to="/profissionais">Cadastro de Profissionais</Link></li>
          <li><Link to="/profissionaisServicos">Cadastro de Profissionais X Serviços</Link></li>
          <li><Link to="/disponibilidades">Cadastro de Disponibilidade dos Profissionais</Link></li>
          <li><Link to="/agendamentos">Agendamento por Serviço e Profissional</Link></li>
          <li><Link to="/agendamentoTodosProfissionais">Agendamento por Serviço (Todos Profissionais)</Link></li>
          <li><Link to="/agendamentoTodosServicos">Agendamento por Profissional (Todos Serviços)</Link></li>
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
