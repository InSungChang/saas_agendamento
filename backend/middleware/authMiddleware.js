// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido' });
    }
};

