const db = require('../config/db');

const ProfissionalServico = {
  create: (profissionalServico, callback) => {
    const query = `INSERT INTO profissional_servicos (profissional_id, servico_id) VALUES (?, ?)`;
    db.query(query, [profissionalServico.profissional_id, profissionalServico.servico_id], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
};

module.exports = ProfissionalServico;