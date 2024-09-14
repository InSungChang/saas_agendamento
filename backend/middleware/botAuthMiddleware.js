const botAuthMiddleware = (req, res, next) => {
    const botToken = req.header('X-Bot-Token');
    
    if (!botToken || botToken !== process.env.BOT_API_TOKEN) {
      return res.status(401).json({ error: 'Acesso não autorizado' });
    }
    
    next();
  };
  
  module.exports = botAuthMiddleware;