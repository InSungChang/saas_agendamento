const db = require('../config/db');
const Profissional = require('../models/Profissional');

exports.createProfissional = (req, res) => {
  const { empresa_id, nome } = req.body;
  const novoProfissional = { empresa_id, nome };

  Profissional.create(novoProfissional, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar profissional', error: err });
    }
    res.status(201).send({ message: 'Profissional criado com sucesso', profissionalId: result.insertId });
  });
};

exports.updateProfissional = async (req, res) => {
  const { id } = req.params;
  const { empresa_id, nome } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE profissionais SET empresa_id = ?, nome = ? WHERE id = ?',
      [empresa_id, nome, id]
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
    console.error('Erro ao deletar profissional:', error);
    res.status(500).json({ error: 'Erro ao deletar profissional' });
  }
};

