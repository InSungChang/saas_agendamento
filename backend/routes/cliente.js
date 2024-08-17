const express = require('express');
const router = express.Router();

const db = require('../config/db');

const clienteController = require('../controllers/clienteController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/clientes', authMiddleware, clienteController.createCliente);

// Rota para obter todos os clientes
/* router.get('/clientes', authMiddleware,  async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM clientes');
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({
            error: 'Erro ao buscar clientes'
        });
    }
}); */

router.get('/clientes', authMiddleware, async (req, res) => {
    const empresa_id = req.user.empresa_id;
    try {
        const [results] = await db.promise().query('SELECT * FROM clientes WHERE empresa_id = ?', [empresa_id]);
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

// Rota para obter um cliente específico
router.get('/clientes/:id', authMiddleware, async (req, res) => {
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

// Rota para buscar clientes por empresa
router.get('/clientes/:empresa_id', async (req, res) => {
    const empresa_id = req.params.empresa_id;
    try {
        const clientes = await db.query('SELECT * FROM clientes WHERE empresa_id = ?', [empresa_id]);
        res.json(clientes);
    } catch (error) {
        res.status(500).send('Erro ao buscar clientes');
    }
});

// Rota para atualizar um cliente
router.put('/clientes/:id', authMiddleware, clienteController.updateCliente);

// Rota para deletar um cliente
router.delete('/clientes/:id', authMiddleware, clienteController.deleteCliente);

module.exports = router;

