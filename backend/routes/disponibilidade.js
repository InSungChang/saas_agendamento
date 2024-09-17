const express = require('express');
const router = express.Router();
const disponibilidadeController = require('../controllers/disponibilidadeController');
const authMiddleware = require('../middleware/authMiddleware');
const botAuthMiddleware = require('../middleware/botAuthMiddleware');

const db = require('../config/db');

/* Para utilizar com ManyChat */
router.post('/disponibilidades/verificar', authMiddleware, disponibilidadeController.verificarDisponibilidade);

router.post('/disponibilidades', authMiddleware, disponibilidadeController.createDisponibilidade);

// Nova rota para buscar disponibilidades por profissional e intervalo de datas para web
router.get('/web/disponibilidades/profissional/:profissional_id', authMiddleware, async (req, res) => {
  const {
    profissional_id
  } = req.params;
  console.log("Profissional no API WEB: ", profissional_id);

  try {
    const [results] = await db.promise().query(
      'SELECT * FROM disponibilidades WHERE profissional_id = ?',
      [profissional_id]
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar disponibilidades:', error);
    res.status(500).json({
      error: 'Erro ao buscar disponibilidades'
    });
  }
});

// Nova rota para buscar disponibilidades por profissional e intervalo de datas Para integrar com WhatsApp
router.get('/bot/disponibilidades/profissional/:profissionalId', botAuthMiddleware, async (req, res) => {
  const {
    profissionalId
  } = req.params;
  const empresa_id = req.query.empresa_id;
  const servicoDuracao = req.query.servico_duracao;
  console.log("Serviço ID no API disponibilidades/profissional: ", servicoDuracao);
 
  try {
    // Buscar disponibilidades do profissional
    const [disponibilidades] = await db.promise().query(
      'SELECT * FROM disponibilidades WHERE profissional_id = ?',
      [profissionalId]
    );

    console.log("Disponibilidades: ", disponibilidades);

    // Buscar serviço associado ao profissional
    const [servicos] = await db.promise().query(
      'SELECT s.* FROM servicos s JOIN profissional_servicos ps ON s.id = ps.servico_id WHERE ps.profissional_id = ?',
      [profissionalId]
    );

    console.log("Serviços: ", servicos);

    if (servicos.length === 0) {
      return res.status(404).json({
        error: 'Nenhum serviço encontrado para este profissional'
      });
    }

    /* const servicoDuracao = servicos[0].duracao; */ 

    // Buscar agendamentos existentes
    const [agendamentos] = await db.promise().query(
      `SELECT a.*, c.nome as cliente_nome, s.nome as servico_nome, s.duracao as servico_duracao
       FROM agendamentos a
       JOIN clientes c ON a.cliente_id = c.id
       JOIN servicos s ON a.servico_id = s.id
       WHERE a.profissional_id = ? AND a.empresa_id = ?`,
      [profissionalId, empresa_id]
    );

    const disponibilidadesFormatadas = formatarDisponibilidades(disponibilidades, 7, servicoDuracao);
    const disponibilidadesFiltradas = filtrarHorarios(disponibilidadesFormatadas, agendamentos);

    res.json(disponibilidadesFiltradas);
  } catch (error) {
    console.error('Erro ao buscar disponibilidades:', error);
    res.status(500).json({
      error: 'Erro ao buscar disponibilidades'
    });
  }
});

// Funções auxiliares (adaptar conforme necessário)
function formatarDisponibilidades(disponibilidades, dias, servicoDuracao) {
  if (!disponibilidades || disponibilidades.length === 0) {
    return [];
  }

  console.log("Duração: ", servicoDuracao);

  const hoje = new Date();
  const disponibilidadesFormatadas = [];
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  for (let i = 0; i < dias; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    const diaSemana = diasSemana[data.getDay()];

    const disponibilidadesDoDia = disponibilidades.filter(d => d.dia_semana === diaSemana);

    if (disponibilidadesDoDia.length > 0) {
      const horariosDistribuidos = distribuirHorarios(disponibilidadesDoDia[0], servicoDuracao);

      disponibilidadesFormatadas.push({
        data: data.toISOString().split('T')[0],
        diaSemana: diaSemana,
        horarios: horariosDistribuidos
      });
    }
  }

  return disponibilidadesFormatadas;
};

function distribuirHorarios(disponibilidade, servicoDuracao) {
  const horarios = [];
  const inicio = new Date(`2000-01-01T${disponibilidade.hora_inicio}`);
  const fim = new Date(`2000-01-01T${disponibilidade.hora_fim}`);

  while (inicio < fim) {
    const horarioFim = new Date(inicio.getTime() + servicoDuracao * 60000);
    if (horarioFim <= fim) {
      horarios.push({
        inicio: inicio.toTimeString().slice(0, 5),
        fim: horarioFim.toTimeString().slice(0, 5)
      });
    }
    inicio.setTime(inicio.getTime() + servicoDuracao * 60000);
  }

  return horarios;

};

function filtrarHorarios(disponibilidades, agendamentos) {
  return disponibilidades.map(dia => {
    const horariosFiltrados = dia.horarios.map(horario => {
      const horarioInicio = new Date(`${dia.data}T${horario.inicio}`);
      const horarioFim = new Date(`${dia.data}T${horario.fim}`);

      const agendamentoConflito = agendamentos.find(ag => {
        const agendamentoInicio = new Date(ag.data_horario_agendamento);
        const agendamentoFim = new Date(ag.data_horario_agendamento);
        agendamentoFim.setMinutes(agendamentoFim.getMinutes() + ag.servico_duracao);

        return (
          (agendamentoInicio < horarioFim) &&
          (agendamentoFim > horarioInicio)
        );
      });

      return {
        ...horario,
        ocupado: Boolean(agendamentoConflito),
        cliente_nome: agendamentoConflito ? agendamentoConflito.cliente_nome : null,
        servico_nome: agendamentoConflito ? agendamentoConflito.servico_nome : null
      };
    });

    return {
      ...dia,
      horarios: horariosFiltrados
    };
  });
};

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
  const {
    servico_id
  } = req.params;

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
    res.status(500).json({
      error: 'Erro ao buscar disponibilidades por serviço'
    });
  }
});

// Rota para filtrar por profissional de todos os serviços
router.get('/disponibilidades/profissionalservico/:profissional_id', authMiddleware, async (req, res) => {
  const {
    profissional_id
  } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT d.*, s.nome as servico_nome, s.duracao as servico_duracao, s.id as servico_id
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
    res.status(500).json({
      error: 'Erro ao buscar disponibilidades por profissional x serviço'
    });
  }
});

/* router.get('/disponibilidades/profissional/:profissional_id', authMiddleware, disponibilidadeController.getDisponibilidadesByProfissional); */

router.delete('/disponibilidades/:id', authMiddleware, disponibilidadeController.deleteDisponibilidade);

module.exports = router;