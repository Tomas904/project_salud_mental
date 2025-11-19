const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/rateLimiter');
const logger = require('./middlewares/logger');
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: [FRONTEND_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// Logger
app.use(logger);

// Rate limiting
app.use('/api/', limiter);

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// API Routes
app.use('/api/v1', routes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Positive Life API',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;