const db = require('../config/db');
const bcrypt = require('bcrypt');

const Usuario = {
  create: (usuario, callback) => {
    bcrypt.hash(usuario.senha, 10, (err, hash) => {
      if (err) {
        return callback(err);
      }
      const query = `INSERT INTO usuarios (empresa_id, nome, email, senha, papel) VALUES (?, ?, ?, ?, ?)`;
      db.query(query, [usuario.empresa_id, usuario.nome, usuario.email, hash, usuario.papel], (err, result) => {
        if (err) {
          return callback(err);
        }
        callback(null, result);
      });
    });
  }
};

module.exports = Usuario;
