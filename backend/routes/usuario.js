const express = require('express');
const router = express.Router();

const db = require('../config/db');

const usuarioController = require('../controllers/usuarioController');

router.post('/usuarios', usuarioController.createUsuario);

// Rota para obter todos os usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM usuarios');
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar usuarios:', error);
        res.status(500).json({
            error: 'Erro ao buscar usuarios'
        });
    }
});

// Rota para obter um usuário específico
router.get('/usuarios/:id', async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const [results] = await db.promise().query('SELECT * FROM usuarios WHERE usuario_id = ?', [id]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            error: 'Erro ao buscar usuário'
        });
    }
});

// Rota para atualizar um usuário
router.put('/usuarios/:id', usuarioController.updateUsuario);

// Rota para deletar um usuário
router.delete('/usuarios/:id', usuarioController.deleteUsuario);

module.exports = router;
