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
}

module.exports = Agendamento;