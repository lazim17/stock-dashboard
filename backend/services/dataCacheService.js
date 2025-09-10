const externalDataService = require('./externalDataService');
const redisService = require('./redisService');
const holdings = require('../data/holdings.json');

class StockCacheService {
  constructor() {
    this.isJobRunning = false;
    this.jobScheduled = false;
  }

  async fetchAndCacheStockData() {
    if (this.isJobRunning) return;



    try {
      this.isJobRunning = true;
      
      const symbols = holdings.map(holding => holding.symbol);
      const stockYahooData = await externalDataService.getYahooFinanceData(symbols);
      
      await redisService.set('stock_data', stockYahooData, 900);

      for (const stock of stockYahooData) {
        await redisService.set(`stock:${stock.symbol}`, stock, 900);
      }
      
      await redisService.set('stock_data_last_updated', Date.now(), 900);
      
    } catch (error) {
      console.error('Error in stock data fetch:', error);
    } finally {
      this.isJobRunning = false;
    }
  }

  async getCachedStockData() {
    try {
      const cachedData = await redisService.get('stock_data');
      const lastUpdated = await redisService.get('stock_data_last_updated');
      
      return {
        data: cachedData,
        lastUpdated: lastUpdated,
      };
    } catch (error) {
      console.error('Error getting cached stock data:', error);
      return { data: null, lastUpdated: null, isStale: true };
    }
  }

  startPeriodicJob(intervalMinutes = 1) {
    if (this.jobScheduled) {
      return;
    }

    this.fetchAndCacheStockData();

    const intervalMs = intervalMinutes * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.fetchAndCacheStockData();
    }, intervalMs);
    
    this.jobScheduled = true;
  }

  stopPeriodicJob() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.jobScheduled = false;
  }
}

module.exports = new StockCacheService();