import React, { useState } from 'react';
import axios from 'axios';
import './ClienteForm.css';

const ClienteForm = () => {
  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/clientes', cliente);
      console.log(response.data);
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="cadastro-clientes-container">
        <h1>Cadastro de Clientes</h1>
        <div className="cadastro-form">
            <label>Nome</label>
            <input type="text" name="nome" value={cliente.nome} onChange={handleChange} required />
            <label>Email</label>
            <input type="email" name="email" value={cliente.email} onChange={handleChange} required />
            <label>Telefone</label>
            <input type="text" name="telefone" value={cliente.telefone} onChange={handleChange} />
            <label>Endereço</label>
            <input type="text" name="endereco" value={cliente.endereco} onChange={handleChange} />
        </div>
        <button type="submit">Criar Cliente</button>
      </div>
    </form>
  );
};

export default ClienteForm;