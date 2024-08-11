import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './EmpresaForm.css';

const EmpresaForm = () => {
  const [empresa, setEmpresa] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  const [message, setMessage] = useState(''); // Estado para armazenar a mensagem de sucesso ou erro
  const navigate = useNavigate(); // Criar a instância de navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/empresas', empresa);
      console.log(response.data);
      setMessage('Empresa cadastrada com sucesso!'); // Definir a mensagem de sucesso
      // Redirecionar após um breve intervalo para permitir que o usuário veja a mensagem
      setTimeout(() => {
        navigate('/dashboard'); // Redirecionar para a página de dashboard
      }, 2000); // Esperar 2 segundos
    } catch (err) {
      console.error('Erro ao criar empresa:', err);
      setMessage('Erro ao cadastrar empresa. Tente novamente mais tarde.'); // Mensagem de erro
    }
  };

  const handleCancel = () => {
    // Redirecionar para a página inicial ou dashboard
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="cadastro-empresas-container">
        <h1>Cadastro das Empresas</h1>
        <div className="cadastro-form">
            <label>Nome</label>
            <input type="text" name="nome" value={empresa.nome} onChange={handleChange} required />
            <label>Email</label>
            <input type="email" name="email" value={empresa.email} onChange={handleChange} required />
            <label>Telefone</label>
            <input type="text" name="telefone" value={empresa.telefone} onChange={handleChange} />
            <label>Endereço</label>
            <input type="text" name="endereco" value={empresa.endereco} onChange={handleChange} />
        </div>
        <button type="submit">Criar Empresa</button>
        <button className="sair-button" type="button" onClick={handleCancel}>Sair</button> {/* Botão Sair */}
        {message && <p>{message}</p>} {/* Exibir a mensagem de sucesso ou erro */}
      </div>
    </form>
  );
};

export default EmpresaForm;
