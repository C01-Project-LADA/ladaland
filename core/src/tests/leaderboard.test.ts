import request from 'supertest';
import express from 'express';
import session from 'express-session';
import leaderboardRoute from '../../src/routes/leaderboard';

jest.mock('@prisma/client', () => {
  const mUser = {
    findMany: jest.fn(),
  };
  const mPrismaClient = jest.fn(() => ({
    user: mUser,
  }));
  return { PrismaClient: mPrismaClient };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const findManyMock = prisma.user.findMany as jest.Mock;

describe('Leaderboard Route', () => {
  let app: express.Express;
  const sessionUser = { id: '2', username: 'User2', email: 'user2@example.com' };

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

    app.use('/api', leaderboardRoute);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized. Please log in.');
  });

  it('should return leaderboard sorted by visited countries by default', async () => {
    const fakeUsers = [
      { id: '1', username: 'User1', visitedCountries: 'US,CA,MX', points: 500 },
      { id: '2', username: 'User2', visitedCountries: 'US,CA', points: 600 },
      { id: '3', username: 'User3', visitedCountries: '', points: 400 },
    ];
    findManyMock.mockResolvedValueOnce(fakeUsers);

    const agent = request.agent(app);
    await agent.get('/set-session');

    const res = await agent.get('/api/leaderboard');
    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      leaderboard: [
        { id: '1', username: 'User1', visitedCountries: 'US,CA,MX', points: 500, visitedCount: 3 },
        { id: '2', username: 'User2', visitedCountries: 'US,CA', points: 600, visitedCount: 2 },
        { id: '3', username: 'User3', visitedCountries: '', points: 400, visitedCount: 0 },
      ],
      currentUserRanking: 2,
      totalUsers: 3,
    });
  });

  it('should return leaderboard sorted by points when sort query is "points"', async () => {
    const fakeUsers = [
      { id: '1', username: 'User1', visitedCountries: 'US,CA,MX', points: 500 },
      { id: '2', username: 'User2', visitedCountries: 'US,CA', points: 600 },
      { id: '3', username: 'User3', visitedCountries: '', points: 400 },
    ];
    findManyMock.mockResolvedValueOnce(fakeUsers);

    const agent = request.agent(app);
    await agent.get('/set-session');

    const res = await agent.get('/api/leaderboard?sort=points');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      leaderboard: [
        { id: '2', username: 'User2', visitedCountries: 'US,CA', points: 600, visitedCount: 2 },
        { id: '1', username: 'User1', visitedCountries: 'US,CA,MX', points: 500, visitedCount: 3 },
        { id: '3', username: 'User3', visitedCountries: '', points: 400, visitedCount: 0 },
      ],
      currentUserRanking: 1,
      totalUsers: 3,
    });
  });
});
