const yahooFinance = require('yahoo-finance2').default;

class ExternalDataService {
  async getYahooFinanceData(symbols) {
    try {
      const quotes = await yahooFinance.quote(symbols);
      
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
      
      return quotesArray.map(quote => ({
        symbol: quote.symbol,
        cmp: quote.regularMarketPrice || quote.price || 0,
        peRatio: quote.trailingPE || 0,
        dayHigh: quote.regularMarketDayHigh || 0,
        dayLow: quote.regularMarketDayLow || 0,
        volume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0
      }));
    } catch (error) {
      console.error('Error fetching Yahoo Finance data:', error);
      throw error;
    }
  }
}

module.exports = new ExternalDataService();