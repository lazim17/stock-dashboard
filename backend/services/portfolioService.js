const externalDataService = require('./externalDataService');
const dataCacheService = require('./dataCacheService');
const holdings = require('../data/holdings.json');

class PortfolioService {
  async getAllHoldings() {
    try {
      const cached = await dataCacheService.getCachedStockData();
      let stockYahooData;

      if (cached.data && !cached.isStale) {
        stockYahooData = cached.data;
        console.log('using cached stock data');
      } else {
        console.log('fetching fresh data');
        const symbols = holdings.map(holding => holding.symbol);
        stockYahooData = await externalDataService.getYahooFinanceData(symbols);
      }
      
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
          changePercent: Math.round((stock?.changePercent || 0) * 100) / 100,
          latestEarnings: stock?.epsTrailing12Months || 0,
          lastUpdated: cached.lastUpdated
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
        changePercent: 0,
        currentEPS: 0,
        latestEarnings: '₹0'
      }));
    }
  }


}

module.exports = new PortfolioService();