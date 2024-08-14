import React from 'react';
import { Routes, Route } from 'react-router-dom';

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

const App = () => {
  const [token, setToken] = React.useState(null);

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
    <div>
      {token ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/" element={<Dashboard />} />
        </Routes>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
