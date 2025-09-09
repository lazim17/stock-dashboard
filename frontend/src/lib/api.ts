const BASE_URL = 'http://localhost:3001/api';

export interface PortfolioItem {
  particulars: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  exchange: 'NSE' | 'BSE';
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number;
  latestEarnings: string;
}

export const getPortfolio = async (): Promise<PortfolioItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/portfolio`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};
