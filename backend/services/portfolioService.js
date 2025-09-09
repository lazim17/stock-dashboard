const externalDataService = require('./externalDataService');

const holdings = [
  {
    id: 1,
    particulars: 'HDFC Bank',
    symbol: 'HDFCBANK.NS',
    purchasePrice: 1490,
    quantity: 50,
    investment: 74500,
    portfolioPercent: 25,
    exchange: 'NSE',
    cmp: 0,
    presentValue: 0,
    gainLoss: 0,
    peRatio: 0,
    latestEarnings: ''
  },
  {
    id: 2,
    particulars: 'Bajaj Finance',
    symbol: 'BAJFINANCE.NS',
    purchasePrice: 6466,
    quantity: 15,
    investment: 96990,
    portfolioPercent: 30,
    exchange: 'NSE',
    cmp: 0,
    presentValue: 0,
    gainLoss: 0,
    peRatio: 0,
    latestEarnings: ''
  },
  {
    id: 3,
    particulars: 'ICICI Bank',
    symbol: 'ICICIBANK.NS',
    purchasePrice: 780,
    quantity: 84,
    investment: 65520,
    portfolioPercent: 20,
    exchange: 'BSE',
    cmp: 0,
    presentValue: 0,
    gainLoss: 0,
    peRatio: 0,
    latestEarnings: ''
  },
  {
    id: 4,
    particulars: 'Dmart',
    symbol: 'DMART.NS',
    purchasePrice: 3777,
    quantity: 27,
    investment: 101979,
    portfolioPercent: 25,
    exchange: 'NSE',
    cmp: 0,
    presentValue: 0,
    gainLoss: 0,
    peRatio: 0,
    latestEarnings: ''
  }
];

class PortfolioService {
  async getAllHoldings() {
    try {
      const symbols = holdings.map(holding => holding.symbol);
      const stockYahooData = await externalDataService.getYahooFinanceData(symbols); 
      
      const updatedHoldings = holdings.map(holding => {
        const stock = stockYahooData.find(s => s.symbol === holding.symbol);
        const currentPrice = stock?.cmp || 0;
        const presentValue = Math.round(currentPrice * holding.quantity * 100) / 100;
        const gainLoss = Math.round((presentValue - holding.investment) * 100) / 100;
        const gainLossPercent = holding.investment > 0 ? 
          Math.round(((presentValue - holding.investment) / holding.investment) * 10000) / 100 : 0;
        
        return {
          ...holding,
          cmp: currentPrice,
          presentValue: presentValue,
          gainLoss: gainLoss,
          gainLossPercent: gainLossPercent,
          peRatio: stock?.peRatio || 0,
          dayHigh: stock?.dayHigh || 0,
          dayLow: stock?.dayLow || 0,
          change: stock?.change || 0,
          changePercent: Math.round((stock?.changePercent || 0) * 100) / 100
        };
      });
      
      return updatedHoldings;
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      return holdings.map(holding => ({
        ...holding,
        cmp: 0,
        presentValue: 0,
        gainLoss: 0,
        gainLossPercent: 0,
        peRatio: 0,
        dayHigh: 0,
        dayLow: 0,
        change: 0,
        changePercent: 0
      }));
    }
  }

  async fetchCMPData() {
    try {
      const symbols = holdings.map(holding => holding.symbol);
      const stockData = await externalDataService.getYahooFinanceData(symbols);      
      return stockData;
    } catch (error) {
      console.error('Error fetching CMP data:', error);
      throw error;
    }
  }

}

module.exports = new PortfolioService();