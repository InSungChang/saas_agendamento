const db = require('../config/db');
const Agendamento = require('../models/Agendamento');

exports.createAgendamento = async (req, res) => {
  const { empresa_id, cliente_id, profissional_id, servico_id, data_horario_agendamento } = req.body;
  const novoAgendamento = { empresa_id, cliente_id, profissional_id, servico_id, data_horario_agendamento };

  try {
    const result = await Agendamento.create(novoAgendamento);
    res.status(201).send({ message: 'Agendamento criado com sucesso', agendamentoId: result.insertId });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao criar agendamento', error: err });
  }
};

exports.getAgendamentos = async (req, res) => {
  const empresa_id = req.user.empresa_id;
  try {
    const [results] = await db.promise().query('SELECT * FROM agendamentos WHERE empresa_id = ?', [empresa_id]);
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

exports.updateAgendamento = async (req, res) => {
  const { id } = req.params;
  const { cliente_id, profissional_id, servico_id, data_horario_agendamento, status } = req.body;

  try {
    const [result] = await db.promise().query(
      'UPDATE agendamentos SET cliente_id = ?, profissional_id = ?, servico_id = ?, data_horario_agendamento = ?, status = ? WHERE id = ?',
      [cliente_id, profissional_id, servico_id, data_horario_agendamento, status, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Agendamento atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Agendamento não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

exports.deleteAgendamento = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM agendamentos WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Agendamento deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Agendamento não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
};