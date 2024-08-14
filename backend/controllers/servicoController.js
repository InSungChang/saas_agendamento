const db = require('../config/db');
const Servico = require('../models/Servico');

exports.createServico = (req, res) => {
  const { empresa_id, nome, descricao, preco, duracao } = req.body;
  const novoServico = { empresa_id, nome, descricao, preco, duracao };

  Servico.create(novoServico, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar serviço', error: err });
    }
    res.status(201).send({ message: 'Serviço criado com sucesso', servicoId: result.insertId });
  });
};

exports.updateServico = async (req, res) => {
  const { id } = req.params;
  const { empresa_id, nome, descricao, preco, duracao } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE servicos SET empresa_id = ?, nome = ?, descricao = ?, preco = ?, duracao = ? WHERE id = ?',
      [empresa_id, nome, descricao, preco, duracao, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Serviço atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Serviço não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
};

exports.deleteServico = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM servicos WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Serviço deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Serviço não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro ao deletar serviço' });
  }
};

