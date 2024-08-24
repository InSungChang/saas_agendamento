const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/agendamentos', authMiddleware, agendamentoController.createAgendamento);
router.get('/agendamentos', authMiddleware, agendamentoController.getAgendamentos);
router.put('/agendamentos/:id', authMiddleware, agendamentoController.updateAgendamento);
router.delete('/agendamentos/:id', authMiddleware, agendamentoController.deleteAgendamento);
router.get('/agendamentos/profissional/:profissionalId', authMiddleware, agendamentoController.getAgendamentosByProfissional);


module.exports = router;