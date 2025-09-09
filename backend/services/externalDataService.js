const yahooFinance = require('yahoo-finance2').default;

yahooFinance.suppressNotices(['yahooSurvey']);

class ExternalDataService {
  async getYahooFinanceData(symbols) {
    try {
      const quotes = await yahooFinance.quote(symbols);
      
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
      
      return quotesArray.map(quote => ({
        symbol: quote.symbol,
        cmp: quote.regularMarketPrice || quote.price || 0,
        dayHigh: quote.regularMarketDayHigh || 0,
        dayLow: quote.regularMarketDayLow || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap || 0,
      
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,

        peRatio: quote.trailingPE || 0,

        epsTrailing12Months: quote.epsTrailingTwelveMonths || 0,
        epsForward: quote.epsForward || 0,
        epsCurrentYear: quote.epsCurrentYear || 0,
        earningsTimestamp: quote.earningsTimestamp || null,
        earningsTimestampStart: quote.earningsTimestampStart || null,
        earningsTimestampEnd: quote.earningsTimestampEnd || null,
        isEarningsDateEstimate: quote.isEarningsDateEstimate || false,
        
      }));
    } catch (error) {
      console.error('Error fetching Yahoo Finance data:', error);
      throw error;
    }
  }
}

module.exports = new ExternalDataService();