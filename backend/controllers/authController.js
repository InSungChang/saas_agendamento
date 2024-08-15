const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = (req, res) => {
    const { nome, email, senha } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);

    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(sql, [nome, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Usuário registrado com sucesso!');
    });
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(401).send('Usuário não encontrado');
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(senha, user.senha);    

        if (!isPasswordValid) {
            return res.status(401).send('Senha incorreta');
        }

        // Gera o token JWT incluindo o empresa_id
        const token = jwt.sign({ 
            id: user.usuario_id,
            empresa_id: user.empresa_id, // Inclui o empresa_id no payload do token
            nome: user.nome
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Retorna o token e as informações do usuário
        res.json({ token, usuario: { id: user.usuario_id, nome: user.nome, empresa_id: user.empresa_id } });
    });
};
