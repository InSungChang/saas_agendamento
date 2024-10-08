const db = require('../config/db');

/* const Cliente = {
  create: (cliente, callback) => {
    const query = `INSERT INTO clientes (empresa_id, nome, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [cliente.empresa_id, cliente.nome, cliente.email, cliente.telefone, cliente.endereco], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
}; */

const Cliente = {
  create: (cliente) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO clientes (empresa_id, nome, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
      db.query(query, [cliente.empresa_id, cliente.nome, cliente.email, cliente.telefone, cliente.endereco], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
};

module.exports = Cliente;
