const { createApp } = require('./app');
const { connectDb } = require('./config/db');
const env = require('./config/env');

async function start() {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`OfferOS API listening on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
