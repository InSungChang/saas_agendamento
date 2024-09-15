import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaEllipsisV, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Sidebar.css';

import { AuthContext } from '../AuthContext';

const navItems = [
  { path: '/login', label: 'Sair' },
  { path: '/calendarioAgendamento', label: 'Calendário de Agendamento' },
  { path: '/agendamentos', label: 'Agendamento por Serviço e Profissional', group: 'Agendamentos' },
  { path: '/agendamentoTodosProfissionais', label: 'Agendamento por Serviço (Todos Profissionais)', group: 'Agendamentos' },
  { path: '/agendamentoTodosServicos', label: 'Agendamento por Profissional (Todos Serviços)', group: 'Agendamentos' },
  { path: '/empresas', label: 'Cadastro das Empresas', group: 'Cadastros' },
  { path: '/consultarAlterarExcluirEmpresas', label: 'Consultar, Alterar e Excluir Empresas', group: 'Cadastros' },
  { path: '/usuarios', label: 'Cadastro de Usuários', group: 'Cadastros' },
  { path: '/consultarAlterarExcluirUsuarios', label: 'Consultar, Alterar e Excluir Usuários', group: 'Cadastros' },
  { path: '/clientes', label: 'Cadastro de Clientes', group: 'Cadastros' },
  { path: '/consultarAlterarExcluirClientes', label: 'Consultar, Alterar e Excluir Clientes', group: 'Cadastros' },
  { path: '/servicos', label: 'Cadastro de Serviços', group: 'Cadastros' },
  { path: '/profissionais', label: 'Cadastro de Profissionais', group: 'Cadastros' },
  { path: '/profissionaisServicos', label: 'Cadastro de Profissionais X Serviços', group: 'Cadastros' },
  { path: '/disponibilidades', label: 'Cadastro de Disponibilidade dos Profissionais', group: 'Cadastros' },
];

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState({
    Agendamentos: false,
    Cadastros: false
  });

  const { usuarioLogado, empresa } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const renderGroup = (group) => {
    const groupItems = navItems.filter(item => item.group === group);
    
    return (
      <li key={group}>
        <button onClick={() => toggleGroup(group)} className="submenu-toggle">
          {isOpen && <span>{group}</span>}
          {isOpen && (openGroups[group] ? <FaChevronUp /> : <FaChevronDown />)}
        </button>
        {openGroups[group] && (
          <ul className="submenu">
            {groupItems.map(({ path, label }) => (
              <li key={path}>
                <Link to={path}>
                  {isOpen && <span>{label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaEllipsisV /> : <FaBars />}
      </button>
      <p>Empresa: {empresa ? empresa.id + '-' + empresa.nome : 'Carregando...'}</p>
      <p>Usuário: {usuarioLogado ? usuarioLogado.nome : 'Carregando...'}</p>
      <nav className="sidebar-nav">
        <ul>
          {navItems
            .filter(item => !item.group)
            .map(({ path, label }) => (
              <li key={path}>
                <Link to={path}>
                  {isOpen && <span>{label}</span>}
                </Link>
              </li>
            ))}
          {renderGroup('Agendamentos')}
          {renderGroup('Cadastros')} 
        </ul>
      </nav>
    </div>
  );
  
};

export default Sidebar;