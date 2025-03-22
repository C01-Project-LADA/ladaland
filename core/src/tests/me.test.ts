import request from 'supertest';
import express from 'express';
import session from 'express-session';
import meRoute from '../../src/routes/user/me';

jest.mock('@prisma/client', () => {
  const mUser = { findUnique: jest.fn() };
  const mPost = { count: jest.fn() };
  const mPostVote = { count: jest.fn() };
  const mCommentVote = { count: jest.fn() };
  const mTrip = { count: jest.fn() };
  const mPrismaClient = jest.fn(() => ({
    user: mUser,
    post: mPost,
    postVote: mPostVote,
    commentVote: mCommentVote,
    trip: mTrip,
  }));
  return { PrismaClient: mPrismaClient };
});

import { PrismaClient } from '@prisma/client';
const mockedPrisma = new PrismaClient();
const findUniqueMock = mockedPrisma.user.findUnique as jest.Mock;
const postCountMock = mockedPrisma.post.count as jest.Mock;
const postVoteCountMock = mockedPrisma.postVote.count as jest.Mock;
const commentVoteCountMock = mockedPrisma.commentVote.count as jest.Mock;
const tripCountMock = mockedPrisma.trip.count as jest.Mock;

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/set-session', (req, res) => {
  req.session.user = { id: '1', username: 'testUser', email: 'test@example.com' };
  res.status(200).json({ message: 'Session set' });
});

app.use('/api', meRoute);

describe('GET /api/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    const agent = request.agent(app);
    const res = await agent.get('/api/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not authenticated');
  });

  it('should return 404 if user not found', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');
    findUniqueMock.mockResolvedValueOnce(null);
    const res = await agent.get('/api/me');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should return user details and counts successfully', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');
    const user = {
      id: '1',
      username: 'testUser',
      email: 'test@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      points: 100,
    };
    findUniqueMock.mockResolvedValueOnce(user);
    postCountMock.mockResolvedValueOnce(5);
    postVoteCountMock.mockResolvedValueOnce(10);
    commentVoteCountMock.mockResolvedValueOnce(3);
    tripCountMock.mockResolvedValueOnce(2);

    const res = await agent.get('/api/me');
    expect(res.status).toBe(200);
    expect(res.body.postsCount).toBe(5);
    expect(res.body.totalLikes).toBe(13); // 10 post + 3 comment
    expect(res.body.tripsCount).toBe(2);
  });

});
