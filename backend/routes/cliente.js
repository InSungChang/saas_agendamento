const express = require('express');
const router = express.Router();

const db = require('../config/db');

const clienteController = require('../controllers/clienteController');

router.post('/clientes', clienteController.createCliente);

// Rota para obter todos os clientes
router.get('/clientes', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM clientes');
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({
            error: 'Erro ao buscar clientes'
        });
    }
});

module.exports = router;