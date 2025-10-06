// Cargar variables de entorno
require('dotenv').config();

// Configurar zona horaria para Guadalajara, Jalisco, México
const timezone = process.env.TIMEZONE || 'America/Mexico_City';
process.env.TZ = timezone;

// Configurar zona horaria en Node.js
const { DateTime } = require('luxon');

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { connectDB, getDB } = require('./data/connectDB');
const router = require('./router/router');
const AttemptsManager = require('./utils/AttemptsManager');


// Configuración del servidor
const app = express();
const PORT = process.argv[2] || process.env.PORT || 3000;

// Configuración del rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos por defecto
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por IP por defecto
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true, // Retorna rate limit info en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
});

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: process.env.CORS_CREDENTIALS === 'true' || false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Inicializar AttemptsManager
AttemptsManager.initialize();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// Aplicar rate limiting a todas las rutas
app.use(limiter);

// Inicializar servidor y base de datos
const startServer = async () => {
  try {
    // Conectar a la base de datos
    console.log('🔄 Iniciando conexión a la base de datos...');
    await connectDB();
    console.log('✅ Base de datos conectada exitosamente');

    // Configurar rutas para que funcionen con y sin prefijo /api
    app.use(router); // Rutas sin prefijo: /health, /account, etc.
    app.use('/api', router); // Rutas con prefijo: /api/health, /api/account, etc.

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      const now = new Date();
      const mexicoTime = DateTime.now().setZone(timezone);
      
      console.log(`🚀 Servidor PassManager ejecutándose en puerto ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🌐 Accesible desde: http://0.0.0.0:${PORT}`);
      console.log(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || '*'}`);
      console.log(`⏰ Zona horaria: ${timezone}`);
      console.log(`📅 Fecha y hora UTC: ${now.toISOString()}`);
      console.log(`🕐 Hora México (Guadalajara): ${mexicoTime.toFormat('yyyy-MM-dd HH:mm:ss')} ${mexicoTime.offsetNameShort}`);
      console.log(`📋 Rutas disponibles:`);
      console.log(`   - GET / (información del servidor)`);
      console.log(`   - GET /health (estado del servidor)`);
    });

  } catch (error) {
    console.error('❌ Error al inicializar el servidor:', error.message);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();

// Manejo graceful de cierre
process.on('SIGTERM', async () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  try {
    const db = getDB();
    await db.close();
  } catch (error) {
    console.error('Error al cerrar la base de datos:', error.message);
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  try {
    const db = getDB();
    await db.close();
  } catch (error) {
    console.error('Error al cerrar la base de datos:', error.message);
  }
  process.exit(0);
});