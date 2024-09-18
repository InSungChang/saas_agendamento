const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const botAuthMiddleware = require('../middleware/botAuthMiddleware');

router.post('/bot/agendamentos', botAuthMiddleware, agendamentoController.createAgendamentoViaBot);

module.exports = router;
