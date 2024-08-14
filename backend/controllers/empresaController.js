const bcrypt = require('bcrypt');
const db = require('../config/db');
const Empresa = require('../models/Empresa');

const saltRounds = 10;

exports.createEmpresa = (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  const novoEmpresa = { nome, email, telefone, endereco };

  Empresa.create(novoEmpresa, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar empresa', error: err });
    }
    res.status(201).send({ message: 'Empresa criado com sucesso', empresaId: result.insertId });
  });
};

exports.updateEmpresa = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE empresas SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
      [nome, email, telefone, endereco, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Empresa atualizada com sucesso' });
    } else {
      res.status(404).json({ error: 'Empresa não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
};

exports.deleteEmpresa = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM empresas WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Empresa deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Empresa não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    res.status(500).json({ error: 'Erro ao deletar empresa' });
  }
};

