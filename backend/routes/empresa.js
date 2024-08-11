const express = require('express');
const router = express.Router();

const db = require('../config/db');

const empresaController = require('../controllers/empresaController');

router.post('/empresas', empresaController.createEmpresa);

// Rota para obter todas as empresa
router.get('/empresas', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM empresas');
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({
            error: 'Erro ao buscar empresas'
        });
    }
});

// Rota para obter uma empresa específico
router.get('/empresas/:id', async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const [results] = await db.promise().query('SELECT * FROM empresas WHERE id = ?', [id]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({
                error: 'Empresa não encontrada'
            });
        }
    } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        res.status(500).json({
            error: 'Erro ao buscar empresa'
        });
    }
});

// Rota para atualizar uma empresa
router.put('/empresas/:id', empresaController.updateEmpresa);

// Rota para deletar uma empresa
router.delete('/empresas/:id', empresaController.deleteEmpresa);

module.exports = router;
