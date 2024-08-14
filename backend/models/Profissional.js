const db = require('../config/db');

const Profissional = {
  create: (profissional, callback) => {
    const query = `INSERT INTO profissionais (empresa_id, nome) VALUES (?, ?)`;
    db.query(query, [profissional.empresa_id, profissional.nome], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
};

module.exports = Profissional;