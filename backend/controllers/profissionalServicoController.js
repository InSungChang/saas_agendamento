const db = require('../config/db');
const ProfissionalServico = require('../models/ProfissionalServico');

exports.createProfissionalServico = (req, res) => {
  const { profissional_id, servico_id } = req.body;
  const novoProfissionalServico = { profissional_id, servico_id };

  ProfissionalServico.create(novoProfissionalServico, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar associação profissional-serviço', error: err });
    }
    res.status(201).send({ message: 'Associação profissional-serviço criada com sucesso', id: result.insertId });
  });
};

exports.updateProfissionalServico = async (req, res) => {
  const { id } = req.params;
  const { profissional_id, servico_id } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE profissional_servicos SET profissional_id = ?, servico_id = ? WHERE id = ?',
      [profissional_id, servico_id, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Associação profissional-serviço atualizada com sucesso' });
    } else {
      res.status(404).json({ error: 'Associação profissional-serviço não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao atualizar associação profissional-serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar associação profissional-serviço' });
  }
};

exports.deleteProfissionalServico = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM profissional_servicos WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Associação profissional-serviço deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Associação profissional-serviço não encontrada' });
    }
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ 
        message: 'Não é possível excluir associação profissional-serviço. Existem registros vinculados a este profissional-serviços em outros cadastros.'
      });
    } else {
      console.error('Erro ao deletar associação profissional-serviço:', error);
      res.status(500).json({ error: 'Erro ao deletar associação profissional-serviço' });
    }
  }
};

