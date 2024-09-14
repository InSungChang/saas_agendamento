const express = require('express');
const router = express.Router();
const disponibilidadeController = require('../controllers/disponibilidadeController');
const authMiddleware = require('../middleware/authMiddleware');

const db = require('../config/db');

/* Para utilizar com ManyChat */
router.post('/disponibilidades/verificar', authMiddleware, disponibilidadeController.verificarDisponibilidade);

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

// Rota para filtrar por serviço de todos os profissionais
/* router.get('/disponibilidades/servico/:servico_id', authMiddleware, async (req, res) => {
  const { servico_id } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT d.*, p.nome as profissional_nome
       FROM disponibilidades d
       JOIN profissionais p ON d.profissional_id = p.id
       JOIN profissional_servicos ps ON p.id = ps.profissional_id
       WHERE ps.servico_id = ?
       ORDER BY d.hora_inicio`,
      [servico_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar disponibilidades por serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades por serviço' });
  }
}); */
router.get('/disponibilidades/servico/:servico_id', authMiddleware, async (req, res) => {
  const { servico_id } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT d.*, p.nome as profissional_nome, s.duracao as servico_duracao
       FROM disponibilidades d
       JOIN profissionais p ON d.profissional_id = p.id
       JOIN profissional_servicos ps ON p.id = ps.profissional_id
       JOIN servicos s ON ps.servico_id = s.id
       WHERE ps.servico_id = ?
       ORDER BY d.hora_inicio`,
      [servico_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar disponibilidades por serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades por serviço' });
  }
});

// Rota para filtrar por profissional de todos os serviços
router.get('/disponibilidades/profissionalservico/:profissional_id', authMiddleware, async (req, res) => {
  const { profissional_id } = req.params;

  try {
    const [results] = await db.promise().query(
       `SELECT d.*, s.nome as servico_nome, s.duracao as servico_duracao
       FROM disponibilidades d
       JOIN profissionais p ON d.profissional_id = p.id
       JOIN profissional_servicos ps ON p.id = ps.profissional_id
	     JOIN servicos s ON ps.servico_id = s.id
       WHERE ps.profissional_id = ?
       ORDER BY d.hora_inicio`,
      [profissional_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar disponibilidades por profissional x serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades por profissional x serviço' });
  }
});

/* router.get('/disponibilidades/profissional/:profissional_id', authMiddleware, disponibilidadeController.getDisponibilidadesByProfissional); */

router.delete('/disponibilidades/:id', authMiddleware, disponibilidadeController.deleteDisponibilidade);

module.exports = router;
