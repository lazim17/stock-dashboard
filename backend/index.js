const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/portfolio', portfolioRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});