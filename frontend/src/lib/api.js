const BASE_URL = 'http://localhost:3001/api';


export const getPortfolio = async () => {
  try {
    const response = await fetch(`${BASE_URL}/portfolio`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};
