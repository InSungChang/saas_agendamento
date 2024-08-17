const express = require('express');
const router = express.Router();
const disponibilidadeController = require('../controllers/disponibilidadeController');
const authMiddleware = require('../middleware/authMiddleware');

const db = require('../config/db');

router.post('/disponibilidades', authMiddleware, disponibilidadeController.createDisponibilidade);

// Nova rota para buscar disponibilidades por profissional e intervalo de datas
router.get('/disponibilidades/profissional/:profissional_id', authMiddleware, async (req, res) => {
  const { profissional_id } = req.params;

  try {
    const [results] = await db.promise().query(
      'SELECT * FROM disponibilidades WHERE profissional_id = ?',
      [profissional_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar disponibilidades:', error);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades' });
  }
});

/* router.get('/disponibilidades/profissional/:profissional_id', authMiddleware, disponibilidadeController.getDisponibilidadesByProfissional); */

router.delete('/disponibilidades/:id', authMiddleware, disponibilidadeController.deleteDisponibilidade);

module.exports = router;
