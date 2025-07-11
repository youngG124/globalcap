import cron from 'node-cron';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '..', 'top_tickers.json');

async function fetchTopTickers(limit: number = 20) {
    try {
        const res = await axios.get('https://companiesmarketcap.com/');
        const $ = cheerio.load(res.data);
        const tickers:string[] =[];

        $('.company-code').slice(0, limit).each((_, el) => {
            const ticker = $(el).text().trim();
            if (ticker && /^[A-Z0-9.-]+$/.test(ticker)) {
                tickers.push(ticker);
            }
        });

        console.log(tickers);
        fs.writeFileSync(filePath, JSON.stringify(tickers, null, 2));
        console.log(`saved tickers to ${filePath}`);

    } catch (error) {
        console.error('Ticker crawling failed : ', error);
    }
}

export function startCronJobs() {

    console.log('startCronJobs');

    // 1. 22:30
    cron.schedule('30 22 * * *', () => {
        console.log('[CRON] 22:30 - market starts');
        fetchTopTickers();
    });

    // 2. 01:00
    cron.schedule('0 1 * * *', () => {
        console.log('[CRON] 01:00 - mid market');
        fetchTopTickers();
    });

    // 3. 05:00
    cron.schedule('0 5 * * *', () => {
        console.log('[CRON] 05:00 - right after market ends');
        fetchTopTickers();
    });

    // 4. 06:30
    cron.schedule('30 6 * * *', () => {
        console.log('[CRON] 06:30 - after market');
        fetchTopTickers();
    });


    // test. 14:40
    cron.schedule('46 14 * * *', () => {
        console.log('[CRON] 14:40 cron test');
        fetchTopTickers();
    });
}