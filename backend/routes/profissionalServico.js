const express = require('express');
const router = express.Router();

const profissionalServicoController = require('../controllers/profissionalServicoController');

router.post('/profissional-servicos', profissionalServicoController.createProfissionalServico);

router.get('/profissional-servicos', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM profissional_servicos');
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar associações profissional-serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar associações profissional-serviço' });
  }
});

router.get('/profissional-servicos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.promise().query('SELECT * FROM profissional_servicos WHERE id = ?', [id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Associação profissional-serviço não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar associação profissional-serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar associação profissional-serviço' });
  }
});

router.put('/profissional-servicos/:id', profissionalServicoController.updateProfissionalServico);

router.delete('/profissional-servicos/:id', profissionalServicoController.deleteProfissionalServico);

module.exports = router;
