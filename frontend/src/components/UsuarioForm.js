import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './UsuarioForm.css'; 

const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    empresa_id: '',
    nome: '',
    email: '',
    senha: '',
    papel: 'funcionario'
  });
  
  const [message, setMessage] = useState(''); // Estado para armazenar a mensagem de sucesso ou erro
  const [messageType, setMessageType] = useState(''); // Estado para armazenar o tipo de mensagem
  const navigate = useNavigate(); // Criar a instância de navigate
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [empresas, setEmpresas] = useState([]); // Estado para armazenar a lista de empresas
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log('Buscando empresas...');
    setLoading(true);
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/empresas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        console.log('Dados brutos da API:', response);
        const empresasData = response.data.empresas || response.data; 
        console.log('Empresas:', empresasData);
        setEmpresas(empresasData);
      })
      .catch(error => {
        console.error('Erro ao buscar empresas:', error);
      })
      .finally(() => {
        setLoading(false);
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
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/usuarios`, usuario, {
          headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      setMessage('Usuário cadastrado com sucesso!'); // Definir a mensagem de sucesso
      setMessageType('success');
      // Redirecionar após um breve intervalo para permitir que o usuário veja a mensagem
      setTimeout(() => {
        navigate('/dashboard'); // Redirecionar para a página de dashboard
      }, 2000); // Esperar 2 segundos
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      if (err.response && err.response.status === 409) {
        // Status 409 Conflict indica que o e-mail já existe no banco de dados
        setMessage('Este e-mail já está cadastrado. Por favor, use outro e-mail.');
        setMessageType('error');
      } else {
        setMessage('Erro ao cadastrar usuário. Tente novamente mais tarde.');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Redirecionar para a página inicial ou dashboard
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="usuario-form">
      {message && (
        <div className={`floating-message ${messageType}`}>
          {message}
        </div>
      )}
      <div className="cadastro-usuarios-container">
        <h1>Cadastro de Usuários</h1>
        <div className="cadastro-form">
          <label>ID da Empresa</label>
          <select name="empresa_id" value={usuario.empresa_id} onChange={handleChange} required>
            <option value="">Selecione uma empresa</option>
            {empresas.map(empresa => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </select>
          <label>Nome</label>
          <input type="text" name="nome" value={usuario.nome} onChange={handleChange} placeholder="Digite o nome do usuário" required />
          <label>Email</label>
          <input type="email" name="email" value={usuario.email} onChange={handleChange} placeholder="Digite o email" required />
          <label>Senha</label>
          <input type="password" name="senha" value={usuario.senha} onChange={handleChange} placeholder="Digite uma senha" required />
          <label>Papel</label> {/* Novo campo para selecionar o papel */}
          <select name="papel" value={usuario.papel} onChange={handleChange} required>
            <option value="">Selecione um papel</option>
            <option value="admin">Admin</option>
            <option value="funcionario">Funcionário</option>
          </select>
        </div>
        <button className="criar-button" type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Criar Usuário'}
        </button>
        <button 
          className="sair-button" 
          type="button" 
          onClick={handleCancel}
          disabled={loading}
        >
          Sair
        </button>        
        {message && <p className="message success">{message}</p>}
      </div>
    </form>
  );
};

export default UsuarioForm;
