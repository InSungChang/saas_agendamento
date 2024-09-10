const db = require('../config/db');

exports.createCancelamento = async (req, res) => {
  const { agendamento_id } = req.body;
  const empresa_id = req.user.empresa_id;
  const usuario_id = req.user.id; // Pega o ID do usuário logado

  if (!agendamento_id) {
    return res.status(400).send({ message: 'ID do agendamento é obrigatório.' });
  }

  const connection = await db.promise();

  try {
    await connection.beginTransaction();

    // Buscar informações do agendamento
    const [agendamento] = await connection.query(
      'SELECT * FROM agendamentos WHERE id = ? AND empresa_id = ?',
      [agendamento_id, empresa_id]
    );

    if (agendamento.length === 0) {
      await connection.rollback();
      return res.status(404).send({ message: 'Agendamento não encontrado.' });
    }

    const agendamentoInfo = agendamento[0];

    // Inserir na tabela de cancelamentos com o ID do usuário e a data de criação do agendamento
    const [resultCancelamento] = await connection.query(
      `INSERT INTO cancelamentos 
       (empresa_id, cliente_id, profissional_id, servico_id, data_horario_cancelado, status, usuario_id, criado_em_agendamento) 
       VALUES (?, ?, ?, ?, ?, 'cancelado', ?, ?)`,
      [agendamentoInfo.empresa_id, agendamentoInfo.cliente_id, agendamentoInfo.profissional_id, agendamentoInfo.servico_id, agendamentoInfo.data_horario_agendamento, usuario_id, agendamentoInfo.criado_em]
    );

    // Deletar da tabela de agendamentos
    await connection.query('DELETE FROM agendamentos WHERE id = ?', [agendamento_id]);

    await connection.commit();

    res.status(201).send({ 
      message: 'Agendamento cancelado com sucesso', 
      cancelamentoId: resultCancelamento.insertId 
    });

  } catch (err) {
    await connection.rollback();
    console.error('Erro ao cancelar agendamento:', err);
    res.status(500).send({ message: 'Erro ao cancelar agendamento', error: err.message });
  }
};

exports.getCancelamentos = async (req, res) => {
  const empresa_id = req.user.empresa_id;
  try {
    const [results] = await db.promise().query(
      `SELECT c.*, cl.nome AS cliente_nome, p.nome AS profissional_nome, s.nome AS servico_nome
       FROM cancelamentos c
       JOIN clientes cl ON c.cliente_id = cl.id
       JOIN profissionais p ON c.profissional_id = p.id
       JOIN servicos s ON c.servico_id = s.id
       WHERE c.empresa_id = ?`,
      [empresa_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar cancelamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar cancelamentos' });
  }
};

