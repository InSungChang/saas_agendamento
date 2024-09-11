const Disponibilidade = require('../models/Disponibilidade');

exports.createDisponibilidade = (req, res) => {
  const { profissional_id, dia_semana, hora_inicio, hora_fim } = req.body;
  const novaDisponibilidade = { profissional_id, dia_semana, hora_inicio, hora_fim };

  Disponibilidade.create(novaDisponibilidade, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar disponibilidade', error: err });
    }
    res.status(201).send({ message: 'Disponibilidade criada com sucesso', disponibilidadeId: result.insertId });
  });
};

exports.getDisponibilidadesByProfissional = (req, res) => {
  const { profissional_id } = req.params;

  /* console.log(`Profissional ID recebido: ${profissional_id}`); */ // Log para depuração

  Disponibilidade.getByProfissional(profissional_id, (err, disponibilidades) => {
    if (err) {
      console.error('Erro ao buscar disponibilidades:', err); // Log detalhado do erro
      return res.status(500).send({ message: 'Erro ao buscar disponibilidades', error: err });
    }
    res.status(200).json(disponibilidades);
  });
};

exports.deleteDisponibilidade = (req, res) => {
  const { id } = req.params;

  Disponibilidade.delete(id, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao excluir disponibilidade', error: err });
    }
    res.status(200).send({ message: 'Disponibilidade excluída com sucesso' });
  });
};

/* Para utilizar com ChatBot */
exports.verificarDisponibilidade = async (req, res) => {
  const { profissional_id, data_horario_agendamento, duracao } = req.body;

  try {
    const [result] = await db.promise().query(
      `SELECT * FROM agendamentos 
       WHERE profissional_id = ? 
       AND (? < TIMESTAMPADD(MINUTE, ?, data_horario_agendamento)) 
       AND (TIMESTAMPADD(MINUTE, ?, ?) > data_horario_agendamento)`,
      [profissional_id, data_horario_agendamento, duracao, duracao, data_horario_agendamento]
    );

    if (result.length > 0) {
      return res.status(200).send({ disponivel: false, message: 'Horário indisponível' });
    } else {
      return res.status(200).send({ disponivel: true, message: 'Horário disponível' });
    }
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    res.status(500).send({ message: 'Erro ao verificar disponibilidade', error: error.message });
  }
};
