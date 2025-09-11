require('dotenv').config();
console.log('Environment loading check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REDISHOST:', process.env.REDISHOST);
console.log('REDISPASSWORD:', process.env.REDISPASSWORD);

const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolio');
const redisService = require('./services/redisService');
const dataCacheService = require('./services/dataCacheService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/portfolio', portfolioRoutes);

async function initializeServices() {
  try {
    await redisService.connect();
    dataCacheService.startPeriodicJob(0.25);
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }
}

app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  await initializeServices();
});

process.on('SIGINT', async () => {
  await redisService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await redisService.disconnect();
  process.exit(0);
});