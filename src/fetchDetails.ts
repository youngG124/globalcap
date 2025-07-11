import axios from 'axios';

export async function fetchCompanyInfo(ticker: string) {
    try {
        const url = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${process.env.FMP_API_KEY}`;
        const res = await axios.get(url);
        const data = res.data[0];

        const marketCapUSD = await convertToUSD(data.mktCap, data.currency);

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

async function convertToUSD(mktCap: number, currency: string): Promise<number> {
    if (currency === 'USD') return mktCap;

    try {
        const url = `https://search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=${currency}&u8=down&u2=1`
        const res = await axios.get(url);
        const rate = res.data?.info?.rate;

    if (!rate) {
        console.warn(`환율 정보 없음: ${currency}`);
        return mktCap;
    }

        return mktCap * rate;
    } catch (e) {
        console.warn(`환율 변환 실패: ${currency}, 원래 값 사용`);
        return mktCap;
    }
}