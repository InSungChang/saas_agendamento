const db = require('../config/db');
const Agendamento = require('../models/agendamento');

// Função para verificar conflitos de agendamento
const verificarConflitoAgendamento = async (empresa_id, profissional_id, data_horario_agendamento, servico_id) => {
  const [result] = await db.promise().query(
    `SELECT * FROM agendamentos 
     WHERE empresa_id = ? 
     AND profissional_id = ? 
     AND (
       (? < TIMESTAMPADD(MINUTE, (SELECT duracao FROM servicos WHERE id = agendamentos.servico_id), data_horario_agendamento)) 
       AND 
       (TIMESTAMPADD(MINUTE, (SELECT duracao FROM servicos WHERE id = ?), ?) > data_horario_agendamento)
     )`,
    [empresa_id, profissional_id, data_horario_agendamento, servico_id, data_horario_agendamento]
  );
/*   console.log('Resultado da verificação: ', result); */  
  return result.length > 0;
};


exports.createAgendamento = async (req, res) => {
  const { empresa_id, cliente_id, profissional_id, servico_id, data_horario_agendamento, status } = req.body;

  // Verificar se todos os campos obrigatórios foram fornecidos
  if (!empresa_id || !cliente_id || !profissional_id || !servico_id || !data_horario_agendamento) {
    return res.status(400).send({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verificar se já existe um conflito de agendamento
    const conflito = await verificarConflitoAgendamento(empresa_id, profissional_id, data_horario_agendamento, servico_id);
    if (conflito) {
      return res.status(400).send({ message: 'Horário já reservado. Por favor, escolha outro horário.' });
    }

    const novoAgendamento = { empresa_id, cliente_id, profissional_id, servico_id, data_horario_agendamento, status };
    const result = await Agendamento.create(novoAgendamento);
    res.status(201).send({ message: 'Agendamento criado com sucesso', agendamentoId: result.insertId });
  } catch (err) {
    res.status(500).send({ message: 'Erro ao criar agendamento', error: err.message });
  }
};

exports.getAgendamentosByProfissional = async (req, res) => {
  const { profissionalId } = req.params;
  const empresa_id = req.user.empresa_id; // Assumindo que o ID da empresa está armazenado no token do usuário
  
  try {
    const [results] = await db.promise().query(
      `SELECT a.id, a.data_horario_agendamento, a.cliente_id, a.servico_id, a.profissional_id, c.nome AS cliente_nome, s.nome AS servico_nome, s.duracao AS servico_duracao
       FROM agendamentos a
       JOIN clientes c ON a.cliente_id = c.id
       JOIN servicos s ON a.servico_id = s.id
       WHERE a.profissional_id = ? AND a.empresa_id = ?`,
      [profissionalId, empresa_id]
    );
    res.json(results);
    console.log('Retorno do sql: ', results);
  } catch (error) {
    console.error('Erro ao buscar agendamentos por profissional:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos por profissional' });
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