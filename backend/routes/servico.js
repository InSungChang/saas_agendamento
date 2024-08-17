const express = require('express');
const router = express.Router();

const db = require('../config/db');

const servicoController = require('../controllers/servicoController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/servicos', authMiddleware, servicoController.createServico);

/* router.get('/servicos', authMiddleware, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM servicos');
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
}); */

router.get('/servicos', authMiddleware, async (req, res) => {
  const empresa_id = req.user.empresa_id;
  try {
      const [results] = await db.promise().query('SELECT * FROM servicos WHERE empresa_id = ?', [empresa_id]);
      res.json(results);
  } catch (error) {
      console.error('Erro ao buscar servicos:', error);
      res.status(500).json({ error: 'Erro ao buscar servicos' });
  }
});

router.get('/servicos/:id', authMiddleware, async (req, res) => {
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

router.get('/servicos/:empresa_id', async (req, res) => {
  const empresa_id = req.params.empresa_id;
  try {
      const servicos = await db.query('SELECT * FROM servicos WHERE empresa_id = ?', [empresa_id]);
      res.json(servicos);
  } catch (error) {
      res.status(500).send('Erro ao buscar serviços');
  }
});

router.put('/servicos/:id', authMiddleware, servicoController.updateServico);

router.delete('/servicos/:id', authMiddleware, servicoController.deleteServico);

module.exports = router;
