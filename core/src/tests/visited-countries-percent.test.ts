import request from 'supertest';
import express from 'express';
import session from 'express-session';
import visitedCountriesRoute from '../../src/routes/visited-countries-percent';

jest.mock('@prisma/client', () => {
  const mUser = {
    findUnique: jest.fn(),
  };
  const mPrismaClient = jest.fn(() => ({
    user: mUser,
  }));
  return { PrismaClient: mPrismaClient };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const userFindUniqueMock = prisma.user.findUnique as jest.Mock;

describe('Visited Countries Percent Route', () => {
  let app: express.Express;
  const sessionUser = { id: '1', username: 'testUser', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(
      session({
        secret: 'testsecret',
        resave: false,
        saveUninitialized: true,
      })
    );

    app.get('/set-session', (req, res) => {
      req.session.user = sessionUser;
      res.status(200).json({ message: 'Session set' });
    });

    app.use('/api', visitedCountriesRoute);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/visitedCountriesPercent');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized. Please log in first.');
  });

  it('should return visited countries percentage for a valid user', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    userFindUniqueMock.mockResolvedValueOnce({ visitedCountries: 'USA,CA,UK' });

    const res = await agent.get('/api/visitedCountriesPercent');

    expect(res.status).toBe(200);
  
    // Expected visitedCount is 3, percentage = ((3/195)*100).toFixed(2) => "1.54%"
    expect(res.body).toEqual({
      visitedCount: 3,
      percentage: '1.54%',
      message: 'You have visited 3/195 countries, which is 1.54% of the world!',
    });
  });
});
