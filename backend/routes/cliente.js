const express = require('express');
const router = express.Router();

const db = require('../config/db');

const clienteController = require('../controllers/clienteController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/clientes', authMiddleware, clienteController.createCliente);

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

// Rota para obter um cliente específico
router.get('/clientes/:id', async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const [results] = await db.promise().query('SELECT * FROM clientes WHERE id = ?', [id]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({
                error: 'Cliente não encontrado'
            });
        }
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({
            error: 'Erro ao buscar cliente'
        });
    }
});

// Rota para atualizar um cliente
router.put('/clientes/:id', clienteController.updateCliente);

// Rota para deletar um cliente
router.delete('/clientes/:id', clienteController.deleteCliente);

module.exports = router;

