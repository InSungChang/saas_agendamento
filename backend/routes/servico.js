const express = require('express');
const router = express.Router();

const db = require('../config/db');

const servicoController = require('../controllers/servicoController');

router.post('/servicos', servicoController.createServico);

router.get('/servicos', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM servicos');
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

router.get('/servicos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.promise().query('SELECT * FROM servicos WHERE id = ?', [id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Serviço não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
});

router.put('/servicos/:id', servicoController.updateServico);

router.delete('/servicos/:id', servicoController.deleteServico);

module.exports = router;
