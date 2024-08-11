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
  const navigate = useNavigate(); // Criar a instância de navigate

  const [empresas, setEmpresas] = useState([]); // Estado para armazenar a lista de empresas

  useEffect(() => {
    console.log('Buscando empresas...');
    axios.get('http://localhost:5000/api/empresas')
      .then(response => {
        console.log('Dados brutos da API:', response);
        const empresasData = response.data.empresas || response.data; 
        console.log('Empresas:', empresasData);
        setEmpresas(empresasData);
      })
      .catch(error => {
        console.error('Erro ao buscar empresas:', error);
        alert('Não foi possível carregar a lista de empresas. Verifique o console para mais detalhes.');
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
      setMessage('Usuário cadastrado com sucesso!'); // Definir a mensagem de sucesso
      // Redirecionar após um breve intervalo para permitir que o usuário veja a mensagem
      setTimeout(() => {
        navigate('/dashboard'); // Redirecionar para a página de dashboard
      }, 2000); // Esperar 2 segundos
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      setMessage('Erro ao cadastrar usuário. Tente novamente mais tarde.'); // Mensagem de erro
    }
  };

  const handleCancel = () => {
    // Redirecionar para a página inicial ou dashboard
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <input type="text" name="nome" value={usuario.nome} onChange={handleChange} required />
          <label>Email</label>
          <input type="email" name="email" value={usuario.email} onChange={handleChange} required />
          <label>Senha</label>
          <input type="password" name="senha" value={usuario.senha} onChange={handleChange} required />
          <label>Papel</label> {/* Novo campo para selecionar o papel */}
          <select name="papel" value={usuario.papel} onChange={handleChange} required>
            <option value="">Selecione um papel</option>
            <option value="admin">Admin</option>
            <option value="funcionario">Funcionário</option>
          </select>
        </div>
        <button type="submit">Criar Usuário</button>
        <button className="sair-button" type="button" onClick={handleCancel}>Sair</button> {/* Botão Sair */}
        {message && <p>{message}</p>} {/* Exibir a mensagem de sucesso ou erro */}
      </div>
    </form>
  );
};

export default UsuarioForm;
