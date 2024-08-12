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

  const [messageType, setMessageType] = useState(''); // Estado para armazenar o tipo de mensagem
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/empresas', empresa);
      console.log(response.data);
      setMessage('Empresa cadastrada com sucesso!'); // Definir a mensagem de sucesso
      // Redirecionar após um breve intervalo para permitir que o usuário veja a mensagem
      setMessageType('success');
      setTimeout(() => {
        navigate('/dashboard'); // Redirecionar para a página de dashboard
      }, 2000); // Esperar 2 segundos
    } catch (err) {
      setMessage('Erro ao cadastrar empresa. Tente novamente mais tarde.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      console.error('Erro ao criar empresa:', err);
      setMessage('Erro ao cadastrar empresa. Tente novamente mais tarde.'); // Mensagem de erro
      setError('Erro ao cadastrar empresa. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Redirecionar para a página inicial ou dashboard
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="empresa-form">
      {message && (
        <div className={`floating-message ${messageType}`}>
          {message}
        </div>
      )}
      <div className="cadastro-empresas-container">
        <h1>Cadastro das Empresas</h1>
        <div className="cadastro-form">
            <label>Nome</label>
            <input type="text" name="nome" value={empresa.nome} onChange={handleChange} placeholder="Digite o nome da empresa" required />
            <label>Email</label>
            <input type="email" name="email" value={empresa.email} onChange={handleChange} placeholder="Digite o email" required />
            <label>Telefone</label>
            <input type="text" name="telefone" value={empresa.telefone} onChange={handleChange} placeholder="Digite o telefone"/>
            <label>Endereço</label>
            <input type="text" name="endereco" value={empresa.endereco} onChange={handleChange} placeholder="Digite o endereço"/>
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Carregando...' : 'Criar Empresa'}</button>
        <button className="sair-button" type="button" onClick={handleCancel} disabled={loading}>Sair</button>
        {message && <p className="message success">{message}</p>} {/* Exibe mensagem de sucesso */}
        {error && <p className="message error">{error}</p>} {/* Exibe mensagem de erro */}
      </div>
    </form>
  );
};

export default EmpresaForm;
