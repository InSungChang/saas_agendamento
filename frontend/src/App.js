import React from 'react';
import ClienteForm from './components/ClienteForm';
import UsuarioForm from './components/UsuarioForm';

const App = () => {
  return (
    <div>
      <h1>Cadastro de Clientes</h1>
      <ClienteForm />
      <h1>Cadastro de Usuários</h1>
      <UsuarioForm />
    </div>
  );
};

export default App;
