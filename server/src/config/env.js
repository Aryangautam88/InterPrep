require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'CLIENT_URL'];

function loadEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length && process.env.NODE_ENV !== 'test') {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/offeros-test',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'test-access-secret-min-32-characters',
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshTokenDays: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7,
    cookieSecure: process.env.COOKIE_SECURE === 'true',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@offeros.dev',
    adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
  };
}

module.exports = loadEnv();
