const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/usuario-logado', authMiddleware, (req, res) => {
    res.json(req.user);
});

module.exports = router;
