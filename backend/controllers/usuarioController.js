const bcrypt = require('bcrypt');
const db = require('../config/db');
const Usuario = require('../models/Usuario');

const saltRounds = 10;

exports.createUsuario = (req, res) => {
  const { empresa_id, nome, email, senha, papel } = req.body;
  const novoUsuario = { empresa_id, nome, email, senha, papel };

  Usuario.create(novoUsuario, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar usuário', error: err });
    }
    res.status(201).send({ message: 'Usuário criado com sucesso', usuarioId: result.insertId });
  });
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  /* const { cliente_id, nome, email, senha } = req.body; */
  const { empresa_id, nome, email, papel } = req.body;

  try {
    /* let hashedSenha = senha;
    if (senha) {
      hashedSenha = await bcrypt.hash(senha, saltRounds);
    }

    const [result] = await db.promise().query(
      'UPDATE usuarios SET cliente_id = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
      [cliente_id, nome, email, hashedSenha, id]
    ); */
    
    const [result] = await db.promise().query(
      'UPDATE usuarios SET empresa_id = ?, nome = ?, email = ?, papel = ? WHERE id = ?',
      [empresa_id, nome, email, papel, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuário atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Usuário deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
