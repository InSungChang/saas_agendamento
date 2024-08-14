require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const clienteRoutes = require('./routes/cliente');
const usuarioRoutes = require('./routes/usuario');
const empresaRoutes = require('./routes/empresa');
const servicoRoutes = require('./routes/servico');
const profissionalRoutes = require('./routes/profissional');
const profissionalServicoRoutes = require('./routes/profissionalServico');

/* console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
 */

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', clienteRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', empresaRoutes);
app.use('/api', servicoRoutes);
app.use('/api', profissionalRoutes);
app.use('/api', profissionalServicoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
