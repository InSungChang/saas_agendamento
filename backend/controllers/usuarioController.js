const Usuario = require('../models/Usuario');

exports.createUsuario = (req, res) => {
  const { cliente_id, nome, email, senha } = req.body;
  const novoUsuario = { cliente_id, nome, email, senha };

  Usuario.create(novoUsuario, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar usuário', error: err });
    }
    res.status(201).send({ message: 'Usuário criado com sucesso', usuarioId: result.insertId });
  });
};
