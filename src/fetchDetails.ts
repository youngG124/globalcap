import axios from 'axios';

const FMP_API_KEY = process.env.FMP_API_KEY || 'your_api_key';

export async function fetchCompanyInfo(ticker: string) {
  try {
    const url = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_API_KEY}`;
    const res = await axios.get(url);
    const data = res.data[0];

    return {
      name: data.companyName,
      symbol: data.symbol,
      marketCap: data.mktCap,
      sector: data.sector,
      industry: data.industry,
      price: data.price,
    };
  } catch (err) {
    console.error(`Error fetching ${ticker}:`, err);
    return null;
  }
}
