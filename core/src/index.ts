import dotenv from 'dotenv';
import session from 'express-session';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Routes
import registerRoute from './routes/user/register';
import loginRoute from './routes/user/login';
import visaRequirementsRoute from './routes/visa-requirements';
import visitedCountriesPercentRoute from './routes/visitedCountriesPercent';
import travelSuggestionsRoute from './routes/travel-suggestions';
import markVistedCountriesRoute from './routes/markVistedCountries';
import meRoute from './routes/user/me';
import postsRoute from './routes/posts';
import postVotesRoute from "./routes/post-votes";
import logoutRoute from "./routes/user/logout";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api', visaRequirementsRoute);
app.use('/api', visitedCountriesPercentRoute);
app.use('/api', travelSuggestionsRoute);
app.use('/api', markVistedCountriesRoute);
app.use('/api', meRoute);
app.use('/api/posts', postsRoute);
app.use('/api/post-votes', postVotesRoute);
app.use('/api', logoutRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Core server is running on http://localhost:${port}`);
});
