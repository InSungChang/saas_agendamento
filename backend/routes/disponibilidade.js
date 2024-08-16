const express = require('express');
const router = express.Router();
const disponibilidadeController = require('../controllers/disponibilidadeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/disponibilidades', authMiddleware, disponibilidadeController.createDisponibilidade);
router.get('/disponibilidades/profissional/:profissional_id', authMiddleware, disponibilidadeController.getDisponibilidadesByProfissional);
router.delete('/disponibilidades/:id', authMiddleware, disponibilidadeController.deleteDisponibilidade);

module.exports = router;
