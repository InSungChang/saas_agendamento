const db = require('../config/db');

const Empresa = {
  create: (empresa, callback) => {
    const query = `INSERT INTO empresas (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)`;
    db.query(query, [empresa.nome, empresa.email, empresa.telefone, empresa.endereco], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
};

module.exports = Empresa;
