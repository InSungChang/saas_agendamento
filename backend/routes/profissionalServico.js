const express = require('express');
const router = express.Router();
const db = require('../config/db');

const profissionalServicoController = require('../controllers/profissionalServicoController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  res.json({ message: "Rota base de profissionalServico" });
});

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

router.get('/profissionais-por-servico/:servico_id', authMiddleware, async (req, res) => {
  console.log('Rota acessada:', req.path);
  console.log('Parâmetros:', req.params);
  console.log("no API: ", req.user.empresa_id);
  const { servico_id } = req.params;
  const empresa_id = req.user.empresa_id; // Obtém o empresa_id do usuário autenticado
  console.log("no API: ", empresa_id);
  console.log("no API: ", servico_id);
  try {
    const [results] = await db.promise().query(
      'SELECT p.* FROM profissionais p ' +
      'JOIN profissional_servicos ps ON p.id = ps.profissional_id ' +
      'JOIN servicos s ON ps.servico_id = s.id ' +
      'WHERE ps.servico_id = ? AND p.empresa_id = ? AND s.empresa_id = ?',
      [servico_id, empresa_id, empresa_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar profissionais por serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar profissionais por serviço' });
  }
});

router.put('/profissional-servicos/:id', profissionalServicoController.updateProfissionalServico);

router.delete('/profissional-servicos/:id', profissionalServicoController.deleteProfissionalServico);

module.exports = router;
