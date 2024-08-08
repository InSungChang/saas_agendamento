import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsuarioForm.css'; 

const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    cliente_id: '',
    nome: '',
    email: '',
    senha: ''
  });
  
  const [clientes, setClientes] = useState([]); // Estado para armazenar a lista de clientes

  useEffect(() => {
    console.log('Buscando clientes...');
    axios.get('http://localhost:5000/api/clientes')
      .then(response => {
        console.log('Dados brutos da API:', response);
        const clientesData = response.data.clientes || response.data; 
        console.log('Clientes:', clientesData);
        setClientes(clientesData);
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        alert('Não foi possível carregar a lista de clientes. Verifique o console para mais detalhes.');
      });
  }, []);

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
      <div className="cadastro-usuarios-container">
        <h1>Cadastro de Usuários</h1>
        <div className="cadastro-form">
          <label>ID do Cliente</label>
          <select name="cliente_id" value={usuario.cliente_id} onChange={handleChange} required>
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.cliente_id} value={cliente.cliente_id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          <label>Nome</label>
          <input type="text" name="nome" value={usuario.nome} onChange={handleChange} required />
          <label>Email</label>
          <input type="email" name="email" value={usuario.email} onChange={handleChange} required />
          <label>Senha</label>
          <input type="password" name="senha" value={usuario.senha} onChange={handleChange} required />
        </div>
        <button type="submit">Criar Usuário</button>
      </div>
    </form>
  );
};

export default UsuarioForm;
