import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fetchCompanyInfo } from '../fetchDetails';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const tickersPath = path.join(__dirname, '..', 'top_tickers.json');
        const tickers: string[] = JSON.parse(fs.readFileSync(tickersPath, 'utf-8'));

        const results = await Promise.all(tickers.map(fetchCompanyInfo));
        const validResults = results.filter(Boolean); // null 제거

        const sorted = validResults.sort((a, b) => b!.marketCap - a!.marketCap);
        res.json(sorted);

    } catch (error: any) {
        console.error('FMP API error : ', error.message);
        res.status(500).json({ error: 'Failed to fetch market cap data' });
    }
})

export default router;