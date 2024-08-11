import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ConsultarAlterarExcluir.css';

const AlterarUsuarioForm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [usuario, setUsuario] = useState({
/*     cliente_id: '',
    nome: '',
    email: '',
    senha: ''
 */    
    empresa_id: '',
    nome: '',
    email: '',
    papel: 'funcionario'
  });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (usuarioSelecionado) {
      // Buscar dados do usuário selecionado
      axios.get(`http://localhost:5000/api/usuarios/${usuarioSelecionado}`)
        .then(response => {
          setUsuario(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error);
        });
    } else {
      // Resetar dados do usuário se nenhum usuário estiver selecionado
      setUsuario({
        /* cliente_id: '',
        nome: '',
        email: '',
        senha: '' */
        empresa_id: '',
        nome: '',
        email: '',
        papel: 'funcionario'
      });
    }
  }, [usuarioSelecionado]);

  const fetchUsuarios = () => {
    // Buscar todos os usuários
    axios.get('http://localhost:5000/api/usuarios')
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
        alert('Não foi possível carregar a lista de usuários. Verifique o console para mais detalhes.');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crie um novo objeto sem o campo `senha`
    const usuarioAtualizado = {
    empresa_id: usuario.empresa_id,
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/usuarios/${usuarioSelecionado}`, usuarioAtualizado);
      console.log(response.data);
      setMessage('Usuário atualizado com sucesso!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setMessage('Erro ao atualizar usuário. Tente novamente mais tarde.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${usuarioSelecionado}`);
      setMessage('Usuário excluído com sucesso!');
      
      // Redefina o valor de `usuarioSelecionado` antes de atualizar a lista de usuários
      setUsuarioSelecionado('');

      // Atualize a lista de usuários
      fetchUsuarios();

      setUsuario({
        /* cliente_id: '',
        nome: '',
        email: '',
        senha: '' */
        empresa_id: '',
        nome: '',
        email: '',
        papel: ''
      });

      setTimeout(() => {
        setMessage('');
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      setMessage('Erro ao excluir usuário. Tente novamente mais tarde.');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="alterar-container">
        <h1>Consultar / Alterar / Excluir Usuário</h1>
        <div className="search-container">
          <label>Pesquisar Usuário:</label>
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Buscar por nome" />
        </div>
        <div className="alterar-form">
          <label>Selecionar Usuário</label>
          <select
            name="usuarioSelecionado"
            value={usuarioSelecionado || ''}
            onChange={(e) => setUsuarioSelecionado(e.target.value)}
            required
          >
            <option value="">Selecione um usuário</option>
            {filteredUsuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome}
              </option>
            ))}
          </select>
          {usuarioSelecionado && (
            <>
              <label>ID da Empresa</label>
              < select name="empresa_id" value={usuario.empresa_id} onChange={handleChange} required>
                <option value="">Selecione uma empresa</option>
                {empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
                </option>
                ))}
              </select>
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={usuario.nome}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={usuario.email}
                onChange={handleChange}
                required
              />
              {/* <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={usuario.senha}
                onChange={handleChange}
                required
              /> */}
              <label>Papel</label> {/* Novo campo para selecionar o papel */}
              <select name="papel" value={usuario.papel} onChange={handleChange} required>
                <option value="">Selecione um papel</option>
                <option value="admin">Admin</option>
                <option value="funcionario">Funcionário</option>
              </select>
            </>
          )}
        </div>
        <button type="submit">Atualizar Usuário</button>
        <button type="button" className="delete-button" onClick={handleDelete}>Excluir Usuário</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
        {message && <p>{message}</p>}
      </div>
    </form>
  );
};

export default AlterarUsuarioForm;
