const botAuthMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Remova 'Bearer ' do token
  const botToken = token.split(' ')[1];

  if (botToken !== process.env.BOT_API_TOKEN) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  next();
};

module.exports = botAuthMiddleware;