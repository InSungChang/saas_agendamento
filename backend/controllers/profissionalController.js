const db = require('../config/db');
const Profissional = require('../models/Profissional');

exports.createProfissional = (req, res) => {
  const { empresa_id, nome, email, telefone, ativo, cor } = req.body;
  const novoProfissional = { empresa_id, nome, email, telefone, ativo, cor };

  Profissional.create(novoProfissional, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar profissional', error: err });
    }
    res.status(201).send({ message: 'Profissional criado com sucesso', profissionalId: result.insertId });
  });
};

exports.updateProfissional = async (req, res) => {
  const { id } = req.params;
  const { empresa_id, nome, email, telefone, ativo, cor } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE profissionais SET empresa_id = ?, nome = ?, email = ?, telefone = ?, ativo = ?, cor = ? WHERE id = ?',
      [empresa_id, nome, email, telefone, ativo, cor, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Profissional atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Profissional não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    res.status(500).json({ error: 'Erro ao atualizar profissional' });
  }
};

exports.deleteProfissional = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM profissionais WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Profissional deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Profissional não encontrado' });
    }
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ 
        message: 'Não é possível excluir este profissional. Existem registros vinculados a este profissional em outros cadastros.' 
      });
    } else {
      console.error('Erro ao deletar profissional:', error);
      res.status(500).json({ error: 'Erro ao deletar profissional' });
    }
  }
};
