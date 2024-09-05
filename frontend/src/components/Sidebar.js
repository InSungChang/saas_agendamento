import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaEllipsisV } from 'react-icons/fa'; // Importa os ícones do react-icons/fa
import './Sidebar.css';

import { AuthContext } from '../AuthContext';

const navItems = [
  { path: '/login', label: 'Sair' },
/*   { path: '/agenda', label: 'Calendário de Agendamento - GPT - React Big Calendar' },
  { path: '/agendamento', label: 'Calendário de Agendamento - GPT' }, */
  { path: '/calendarioAgendamento', label: 'Calendário de Agendamento - Claude' },
  { path: '/agendamentos', label: 'Agendamento por Serviço e Profissional' },
  { path: '/agendamentoTodosProfissionais', label: 'Agendamento por Serviço (Todos Profissionais)' },
  { path: '/agendamentoTodosServicos', label: 'Agendamento por Profissional (Todos Serviços)' },
  { path: '/empresas', label: 'Cadastro das Empresas' },
  { path: '/consultarAlterarExcluirEmpresas', label: 'Consultar, Alterar e Excluir Empresas' },
  { path: '/usuarios', label: 'Cadastro de Usuários' },
  { path: '/consultarAlterarExcluirUsuarios', label: 'Consultar, Alterar e Excluir Usuários' },
  { path: '/clientes', label: 'Cadastro de Clientes' },
  { path: '/consultarAlterarExcluirClientes', label: 'Consultar, Alterar e Excluir Clientes' },
  { path: '/servicos', label: 'Cadastro de Serviços' },
  { path: '/profissionais', label: 'Cadastro de Profissionais' },
  { path: '/profissionaisServicos', label: 'Cadastro de Profissionais X Serviços' },
  { path: '/disponibilidades', label: 'Cadastro de Disponibilidade dos Profissionais' },
];

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);

  const { usuarioLogado, empresa } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaEllipsisV /> : <FaBars />} {/* Usa os ícones do react-icons/fa */}
      </button>
      <p>Empresa: {empresa ? empresa.id + '-' + empresa.nome : 'Carregando...'}</p>
      <p>Usuário: {usuarioLogado ? usuarioLogado.nome : 'Carregando...'}</p>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map(({ path, label, icon }) => (
            <li key={path}>
              <Link to={path}>
              {isOpen && <span>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
    </div>
  );
};

export default Sidebar;

