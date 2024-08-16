const db = require('../config/db');

const Disponibilidade = {
  create: (disponibilidade, callback) => {
    const query = `
      INSERT INTO disponibilidades (profissional_id, dia_semana, hora_inicio, hora_fim)
      VALUES (?, ?, ?, ?)`;
    db.query(query, [
      disponibilidade.profissional_id, 
      disponibilidade.dia_semana, 
      disponibilidade.hora_inicio, 
      disponibilidade.hora_fim
    ], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },

  getByProfissional: (profissional_id, callback) => {
    const query = `SELECT * FROM disponibilidades WHERE profissional_id = ?`;
    db.query(query, [profissional_id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = `DELETE FROM disponibilidades WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },
};

module.exports = Disponibilidade;

