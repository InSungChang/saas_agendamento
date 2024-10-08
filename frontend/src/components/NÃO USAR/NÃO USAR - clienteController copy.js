const db = require('../../../../backend/config/db');
const Cliente = require('../../../../backend/models/Cliente');

const saltRounds = 10;

exports.createCliente = (req, res) => {
  const { empresa_id, nome, email, telefone, endereco } = req.body;
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
  const { empresa_id, nome, email, telefone, endereco } = req.body;

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
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
};

