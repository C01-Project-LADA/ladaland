import dotenv from 'dotenv';
import registerRoute from './routes/user/register';
import loginRoute from './routes/user/login';
import visaRequirementsRoute from './routes/visa-requirements';
import visitedCountriesPercentRoute from './routes/visitedCountriesPercent';

dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api', visaRequirementsRoute)
app.use('/api', visitedCountriesPercentRoute)

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Core server is running on http://localhost:${port}`);
});
