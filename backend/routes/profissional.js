const express = require('express');
const router = express.Router();

const db = require('../config/db');

const profissionalController = require('../controllers/profissionalController');

const authMiddleware = require('../middleware/authMiddleware');

const botAuthMiddleware = require('../middleware/botAuthMiddleware');

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

/* Para integrar com WhatsApp */
router.get('/profissionais-por-servico/:servico_id', botAuthMiddleware, async (req, res) => {
  const { servico_id } = req.params;
  const empresa_id = req.query.empresa_id;
  console.log("Empresa Id no API: ", empresa_id);
  console.log("Servico Id no API: ", servico_id);

  try {
    const [results] = await db.promise().query(
      `SELECT DISTINCT p.id, p.nome
       FROM profissionais p
       INNER JOIN profissional_servicos ps ON p.id = ps.profissional_id
       INNER JOIN servicos s ON ps.servico_id = s.id
       WHERE s.id = ? AND s.empresa_id = ? AND p.empresa_id = ?
       ORDER BY p.nome`,
      [servico_id, empresa_id, empresa_id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhum profissional encontrado para este serviço e empresa.' });
    }

    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar profissionais por serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar profissionais por serviço' });
  }
});

router.put('/profissionais/:id', authMiddleware, profissionalController.updateProfissional);

router.delete('/profissionais/:id', authMiddleware, profissionalController.deleteProfissional);

module.exports = router;

