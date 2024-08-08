/* import React from 'react';
import ClienteForm from './components/ClienteForm';
import UsuarioForm from './components/UsuarioForm'; */

/* import React, { useState } from 'react'; */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import UsuarioForm from './components/UsuarioForm';
import ClienteForm from './components/ClienteForm';

/* const App = () => {
  return (
    <div>
      <h1>Cadastro de Clientes</h1>
      <ClienteForm />
      <h1>Cadastro de Usuários</h1>
      <UsuarioForm />
    </div>
  );
}; */

/* const App = () => {
  const [token, setToken] = useState(null);

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
    <div>
      {token ? <Dashboard /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}; */

const App = () => {
  const [token, setToken] = React.useState(null);

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
    <div>
      {token ? (
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<ClienteForm />} />
          <Route path="/usuarios" element={<UsuarioForm />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;