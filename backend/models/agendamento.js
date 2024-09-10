const db = require('../config/db');

class Agendamento {
  static create(agendamento) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO agendamentos SET ?', agendamento, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static cancel(id, empresa_id, usuario_id) {
    return new Promise((resolve, reject) => {
      db.beginTransaction(async (err) => {
        if (err) {
          return reject(err);
        }

        try {
          // Buscar informações do agendamento
          const [agendamento] = await db.promise().query(
            'SELECT * FROM agendamentos WHERE id = ? AND empresa_id = ?',
            [id, empresa_id]
          );

          if (agendamento.length === 0) {
            throw new Error('Agendamento não encontrado.');
          }

          const agendamentoInfo = agendamento[0];

          // Inserir na tabela de cancelamentos com o ID do usuário
          await db.promise().query(
            `INSERT INTO cancelamentos 
             (empresa_id, cliente_id, profissional_id, servico_id, data_horario_cancelado, status, usuario_id) 
             VALUES (?, ?, ?, ?, NOW(), 'cancelado', ?)`,
            [agendamentoInfo.empresa_id, agendamentoInfo.cliente_id, agendamentoInfo.profissional_id, agendamentoInfo.servico_id, usuario_id]
          );

          // Deletar da tabela de agendamentos
          await db.promise().query('DELETE FROM agendamentos WHERE id = ?', [id]);

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                reject(err);
              });
            }
            resolve();
          });
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });
    });
  }
}

module.exports = Agendamento;
