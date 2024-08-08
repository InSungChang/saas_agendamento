const db = require('../config/db');

const Cliente = {
  create: (cliente, callback) => {
    const query = `INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)`;
    db.query(query, [cliente.nome, cliente.email, cliente.telefone, cliente.endereco], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
};

module.exports = Cliente;
