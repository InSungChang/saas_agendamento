import React, { useState } from 'react';
import axios from 'axios';

const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    cliente_id: '',
    nome: '',
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios', usuario);
      console.log(response.data);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ID do Cliente</label>
        <input type="number" name="cliente_id" value={usuario.cliente_id} onChange={handleChange} required />
      </div>
      <div>
        <label>Nome</label>
        <input type="text" name="nome" value={usuario.nome} onChange={handleChange} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={usuario.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Senha</label>
        <input type="password" name="senha" value={usuario.senha} onChange={handleChange} required />
      </div>
      <button type="submit">Criar Usuário</button>
    </form>
  );
};

export default UsuarioForm;
