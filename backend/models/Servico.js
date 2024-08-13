const db = require('../config/db');

const Servico = {
  create: (servico, callback) => {
    const query = `INSERT INTO servicos (empresa_id, nome, descricao, preco, duracao) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [servico.empresa_id, servico.nome, servico.descricao, servico.preco, servico.duracao], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
};

module.exports = Servico;
