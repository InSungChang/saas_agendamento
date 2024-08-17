const express = require('express');
const router = express.Router();

const db = require('../config/db');

const profissionalController = require('../controllers/profissionalController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/profissionais', authMiddleware, profissionalController.createProfissional);

/* router.get('/profissionais', authMiddleware, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM profissionais');
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    res.status(500).json({ error: 'Erro ao buscar profissionais' });
  }
}); */

router.get('/profissionais', authMiddleware, async (req, res) => {
  const empresa_id = req.user.empresa_id;
  try {
      const [results] = await db.promise().query('SELECT * FROM profissionais WHERE empresa_id = ?', [empresa_id]);
      res.json(results);
  } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      res.status(500).json({ error: 'Erro ao buscar profissionais' });
  }
});

router.get('/profissionais/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.promise().query('SELECT * FROM profissionais WHERE id = ?', [id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Profissional não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar profissional:', error);
    res.status(500).json({ error: 'Erro ao buscar profissional' });
  }
});

// Rota para buscar profissionais por empresa
router.get('/profissionais/:empresa_id', async (req, res) => {
  const empresa_id = req.params.empresa_id;
  try {
      const profissionais = await db.query('SELECT * FROM profissionais WHERE empresa_id = ?', [empresa_id]);
      res.json(profissionais);
  } catch (error) {
      res.status(500).send('Erro ao buscar profissionais');
  }
});

router.get('/profissionais-por-servico/:servico_id', authMiddleware, async (req, res) => {
  const { servico_id } = req.params;
  const empresa_id = req.user.empresa_id;
  try {
    const [results] = await db.promise().query(
      'SELECT p.* FROM profissionais p ' +
      'JOIN profissional_servicos ps ON p.id = ps.profissional_id ' +
      'WHERE ps.servico_id = ? AND p.empresa_id = ?',
      [servico_id, empresa_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar profissionais por serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar profissionais por serviço' });
  }
});

router.put('/profissionais/:id', authMiddleware, profissionalController.updateProfissional);

router.delete('/profissionais/:id', authMiddleware, profissionalController.deleteProfissional);

module.exports = router;

