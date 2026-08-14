const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const corsOptions = require('./config/cors');
const env = require('./config/env');
const { generalLimiter } = require('./middleware/rateLimit');
const { notFound, errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/auth.routes');
const roleRoutes = require('./routes/role.routes');
const { sendSuccess } = require('./utils/apiResponse');

function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  if (env.nodeEnv !== 'test') {
    app.use(morgan('dev'));
    app.use(generalLimiter);
  }

  app.get('/api/health', (req, res) => sendSuccess(res, { status: 'ok', service: 'offeros-api' }));
  app.use('/api/auth', authRoutes);
  app.use('/api', roleRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
