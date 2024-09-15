const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

router.post('/agendamentos', authMiddleware, agendamentoController.createAgendamento);
router.get('/agendamentos', authMiddleware, agendamentoController.getAgendamentos);
router.put('/agendamentos/:id', authMiddleware, agendamentoController.updateAgendamento);
router.delete('/agendamentos/:id', authMiddleware, agendamentoController.deleteAgendamento);
router.get('/agendamentos/profissional/:profissionalId', authMiddleware, agendamentoController.getAgendamentosByProfissional);

router.get('/agendamentos/servico/:servico_id', authMiddleware, async (req, res) => {
    const { servico_id } = req.params;
    try {
      const [results] = await db.promise().query(
        `SELECT a.*, c.nome as cliente_nome, s.nome as servico_nome, s.duracao as servico_duracao
         FROM agendamentos a
         JOIN clientes c ON a.cliente_id = c.id
         JOIN servicos s ON a.servico_id = s.id
         WHERE a.servico_id = ?`,
        [servico_id]
      );
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por serviço:', error);
      res.status(500).json({ error: 'Erro ao buscar agendamentos por serviço' });
    }
    });

module.exports = router;