const express = require('express');
const portfolioService = require('../services/portfolioService');
const router = express.Router();

router.get('/', async (req, res) => {
  const holdings = await portfolioService.getAllHoldings();
  res.json({ data: holdings });
});


module.exports = router;