import request from 'supertest';
import express from 'express';
import session from 'express-session';
import markVisitedCountriesRoute from '../../src/routes/mark-visited-countries';

jest.mock('@prisma/client', () => {
  const mUser = {
    findUnique: jest.fn(),
    update: jest.fn(),
  };
  const mTransaction = jest.fn();
  const mPrismaClient = jest.fn(() => ({
    user: mUser,
    $transaction: mTransaction,
  }));
  return { PrismaClient: mPrismaClient };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const userFindUniqueMock = prisma.user.findUnique as jest.Mock;
const transactionMock = prisma.$transaction as jest.Mock;

describe('Mark Visited Countries Routes', () => {
  let app: express.Express;
  const sessionUser = {
    id: '1',
    username: 'testUser',
    email: 'test@example.com',
  };

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

    app.use('/api', markVisitedCountriesRoute);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .post('/api/markVisitedCountries')
      .send({ countryCode: 'US', action: 'add' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized. Please log in.');
  });

  it('should add a visited country and update points', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    userFindUniqueMock.mockResolvedValueOnce({ visitedCountries: 'CA' });
    transactionMock.mockResolvedValueOnce([{}]);

    const res = await agent
      .post('/api/markVisitedCountries')
      .send({ countryCode: 'US', action: 'add' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Country US has been added to your visited countries.',
      visitedCountries: ['CA', 'US'],
      pointsChange: 200,
    });
  });

  it('should return visited countries when GET /getVisitedCountries is called', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    userFindUniqueMock.mockResolvedValueOnce({ visitedCountries: 'CA,US' });

    const res = await agent.get('/api/getVisitedCountries');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      visitedCountries: ['CA', 'US'],
    });
  });
});
