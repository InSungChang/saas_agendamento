const express = require('express');
const router = express.Router();

const db = require('../config/db');

const profissionalController = require('../controllers/profissionalController');

router.post('/profissionais', profissionalController.createProfissional);

router.get('/profissionais', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM profissionais');
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    res.status(500).json({ error: 'Erro ao buscar profissionais' });
  }
});

router.get('/profissionais/:id', async (req, res) => {
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

router.put('/profissionais/:id', profissionalController.updateProfissional);

router.delete('/profissionais/:id', profissionalController.deleteProfissional);

module.exports = router;

