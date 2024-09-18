require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const clienteRoutes = require('./routes/cliente');
const usuarioRoutes = require('./routes/usuario');
const empresaRoutes = require('./routes/empresa');
const servicoRoutes = require('./routes/servico');
const profissionalServicoRoutes = require('./routes/profissionalServico');
const profissionalRoutes = require('./routes/profissional');
const userRoutes = require('./routes/user');
const disponibilidadeRoutes = require('./routes/disponibilidade');
const agendamentoRoutes = require('./routes/agendamento');
const cancelamentoRoutes = require('./routes/cancelamento');
const botRoutes = require('./routes/botRoutes');

const app = express();

app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.path}`);
    next();
});

app.use(cors());
app.use(express.json());

app.use('/api', botRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', clienteRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', empresaRoutes);
app.use('/api', servicoRoutes);
app.use('/api', userRoutes);
app.use('/api', disponibilidadeRoutes);
app.use('/api', agendamentoRoutes);
app.use('/api', cancelamentoRoutes);

app.use('/api/web', profissionalServicoRoutes);
app.use('/api', profissionalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});