/* import React from 'react';
import ClienteForm from './components/ClienteForm';
import UsuarioForm from './components/UsuarioForm'; */
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

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

const App = () => {
  const [token, setToken] = useState(null);

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
    <div>
      {token ? <Dashboard /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
};

export default App;
