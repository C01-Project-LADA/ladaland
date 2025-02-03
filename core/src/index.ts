import dotenv from 'dotenv';
import registerRoute from './routes/user/register';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('HELLO TEAM LADA!!!');
});

app.use('/api', registerRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Core server is running on http://localhost:${port}`);
});
