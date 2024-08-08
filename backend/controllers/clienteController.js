const Cliente = require('../models/Cliente');

exports.createCliente = (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  const novoCliente = { nome, email, telefone, endereco };

  Cliente.create(novoCliente, (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Erro ao criar cliente', error: err });
    }
    res.status(201).send({ message: 'Cliente criado com sucesso', clienteId: result.insertId });
  });
};
