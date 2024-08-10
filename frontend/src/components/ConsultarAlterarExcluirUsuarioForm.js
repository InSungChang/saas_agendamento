import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ConsultarAlterarExcluirUsuarioForm.css';

const AlterarUsuarioForm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [usuario, setUsuario] = useState({
/*     cliente_id: '',
    nome: '',
    email: '',
    senha: ''
 */    cliente_id: '',
    nome: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
        cliente_id: '',
        nome: '',
        email: ''
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
    cliente_id: usuario.cliente_id,
    nome: usuario.nome,
    email: usuario.email
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
        cliente_id: '',
        nome: '',
        email: ''
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
      <div className="alterar-usuario-container">
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
              <option key={usuario.usuario_id} value={usuario.usuario_id}>
                {usuario.nome}
              </option>
            ))}
          </select>
          {usuarioSelecionado && (
            <>
              <label>ID do Cliente</label>
              <input
                type="number"
                name="cliente_id"
                value={usuario.cliente_id}
                onChange={handleChange}
                required
              />
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
