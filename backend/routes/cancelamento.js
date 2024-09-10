const express = require('express');
const router = express.Router();
const cancelamentoController = require('../controllers/cancelamentoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/cancelamentos', authMiddleware, cancelamentoController.createCancelamento);
router.get('/cancelamentos', authMiddleware, cancelamentoController.getCancelamentos);

module.exports = router;