import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import UsuarioForm from './components/UsuarioForm';
import AlterarUsuarioForm from './components/AlterarUsuarioForm';
import ClienteForm from './components/ClienteForm';

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
          <Route path="/clientes" element={<ClienteForm />} />
          <Route path="/usuarios" element={<UsuarioForm />} />
          <Route path="/alterarUsuarios" element={<AlterarUsuarioForm />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;