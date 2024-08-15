const db = require('../config/db');
const Cliente = require('../models/Cliente');

const saltRounds = 10;

exports.createCliente = (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  const empresa_id = req.user.empresa_id; // Usa o empresa_id do usuário logado
  const novoCliente = { empresa_id, nome, email, telefone, endereco };

  Cliente.create(novoCliente, (err, result) => {
      if (err) {
          return res.status(500).send({ message: 'Erro ao criar cliente', error: err });
      }
      res.status(201).send({ message: 'Cliente criado com sucesso', clienteId: result.insertId });
  });
};

exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco } = req.body;
  const empresa_id = req.user.empresa_id; // Obtém o empresa_id da sessão

  try {
    const [result] = await db.promise().query(
      'UPDATE clientes SET empresa_id = ?, nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
      [empresa_id, nome, email, telefone, endereco, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Cliente atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM clientes WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Cliente deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ 
        message: 'Não é possível excluir este cliente. Existem registros vinculados a esta empresa em outros cadastros.' 
      });
    } else {
      console.error('Erro ao deletar cliente:', error);
      res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
  }
};

