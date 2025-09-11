const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    return res.json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  router.post('/account', (req, res) => {
    const { email, password } = req.body;
    
  });


  // Middleware para manejar rutas no encontradas
router.use('*', (req, res) => {
    return res.status(404).json({
      error: 'Ruta no encontrada',
      path: req.originalUrl,
      method: req.method
    });
  });

module.exports = router;