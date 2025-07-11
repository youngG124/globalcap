import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import marketcapRouter from './routes/marketcap';
import { startCronJobs } from './cron';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use('/api/marketcap', marketcapRouter);

app.listen(PORT, () => {
  console.log('현재 시간:', new Date().toString());
  console.log(`Server is running at http://localhost:${PORT}`);
  startCronJobs();
});