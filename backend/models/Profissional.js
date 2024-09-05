const db = require('../config/db');

const Profissional = {
  create: (profissional, callback) => {
    const query = `INSERT INTO profissionais (empresa_id, nome, email, telefone, ativo, cor) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [profissional.empresa_id, profissional.nome, profissional.email, profissional.telefone, profissional.ativo, profissional.cor], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
};

module.exports = Profissional;
