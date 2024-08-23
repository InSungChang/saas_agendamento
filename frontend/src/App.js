import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* import LoginPage from './components/LoginPage'; */
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import EmpresaForm from './components/EmpresaForm';
import ConsultarAlterarExcluirEmpresaForm from './components/ConsultarAlterarExcluirEmpresaForm';
import UsuarioForm from './components/UsuarioForm';
import ConsultarAlterarExcluirUsuarioForm from './components/ConsultarAlterarExcluirUsuarioForm';
import ClienteForm from './components/ClienteForm';
import ConsultarAlterarExcluirClienteForm from './components/ConsultarAlterarExcluirClienteForm';
import ServicoForm from './components/ServicoForm';
import ProfissionalForm from './components/ProfissionalForm';
import ProfissionalServicoForm from './components/ProfissionalServicoForm';
import DisponibilidadeForm from './components/DisponibilidadeForm';
import AgendamentoForm from './components/AgendamentoForm';
import DisponibilidadesPage from './components/DisponibilidadesPage';
import AgendamentoTodosProfissionaisForm from './components/AgendamentoTodosProfissionaisForm';
import DisponibilidadesPageTodosProfissionais from './components/DisponibilidadesPageTodosProfissionais';
import AgendamentoTodosServiosForm from './components/AgendamentoTodosServicosForm';
import DisponibilidadesPageTodosServicos from './components/DisponibilidadesPageTodosServicos';


const App = () => {
  const [token, setToken] = React.useState(null);

  const handleLogin = (token) => {
    localStorage.setItem('token', token); // Armazena o token no localStorage
    setToken(token);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken); // Recupera o token do localStorage ao inicializar
    }
  }, []);

  return (
    <div>
      <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      {token ? (
        <>
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empresas" element={<EmpresaForm />} />
          <Route path="/ConsultarAlterarExcluirEmpresas" element={<ConsultarAlterarExcluirEmpresaForm />} />
          <Route path="/usuarios" element={<UsuarioForm />} />
          <Route path="/consultarAlterarExcluirUsuarios" element={<ConsultarAlterarExcluirUsuarioForm />} />
          <Route path="/clientes" element={<ClienteForm />} />
          <Route path="/ConsultarAlterarExcluirClientes" element={<ConsultarAlterarExcluirClienteForm />} />
          <Route path="/servicos" element={<ServicoForm />} />
          <Route path="/profissionais" element={<ProfissionalForm />} />
          <Route path="/profissionaisServicos" element={<ProfissionalServicoForm />} />
          <Route path="/disponibilidades" element={<DisponibilidadeForm />} />
          <Route path="/agendamentos" element={<AgendamentoForm />} />
          <Route path="/disponibilidadesPage" element={<DisponibilidadesPage />} />
          <Route path="/agendamentoTodosProfissionais" element={<AgendamentoTodosProfissionaisForm />} />
          <Route path="/disponibilidadesPageTodosProfissionais" element={<DisponibilidadesPageTodosProfissionais />} />
          <Route path="/agendamentoTodosServicos" element={<AgendamentoTodosServiosForm />} />
          <Route path="/disponibilidadesPageTodosServicos" element={<DisponibilidadesPageTodosServicos />} />
          <Route path="/" element={<Dashboard />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
      </Routes>
    </div>
  );
};

export default App;
