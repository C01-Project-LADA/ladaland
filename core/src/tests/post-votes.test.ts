import request from 'supertest';
import express from 'express';
import session from 'express-session';
import postVotesRoute from '../../src/routes/post-votes';

jest.mock('@prisma/client', () => {
  const mPostVote = {
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  };
  const mPost = {
    findUnique: jest.fn(),
    update: jest.fn(),
  };
  const mUser = {
    update: jest.fn(),
  };
  const mTransaction = jest.fn();
  const mPrismaClient = jest.fn(() => ({
    postVote: mPostVote,
    post: mPost,
    user: mUser,
    $transaction: mTransaction,
  }));
  return {
    PrismaClient: mPrismaClient,
    VoteType: { LIKE: 'LIKE', DISLIKE: 'DISLIKE' },
  };
});

import { PrismaClient, VoteType } from '@prisma/client';

const prisma = new PrismaClient();
const postVoteFindUniqueMock = prisma.postVote.findUnique as jest.Mock;
const postVoteCreateMock = prisma.postVote.create as jest.Mock;
const postFindUniqueMock = prisma.post.findUnique as jest.Mock;
const postVoteCountMock = prisma.postVote.count as jest.Mock;
const transactionMock = prisma.$transaction as jest.Mock;

describe('POST /api/post-votes/:postId', () => {
  let app: express.Express;

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
      req.session.user = {
        id: '1',
        username: 'testUser',
        email: 'test@example.com',
      };
      res.status(200).json({ message: 'Session set' });
    });

    app.use('/api/post-votes', postVotesRoute);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .post('/api/post-votes/123')
      .send({ voteType: 'LIKE' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should add a new vote if none exists', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    postVoteFindUniqueMock.mockResolvedValueOnce(null);

    postVoteCreateMock.mockResolvedValueOnce({
      id: 'vote1',
      userId: '1',
      postId: '123',
      type: VoteType.LIKE,
    });
    postFindUniqueMock.mockResolvedValueOnce({
      id: '123',
      userId: '1',
      pointsAwarded: 0,
    });
    postVoteCountMock.mockResolvedValueOnce(5);
    transactionMock.mockResolvedValueOnce([{}, {}]);

    const res = await agent
      .post('/api/post-votes/123')
      .send({ voteType: 'LIKE' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('LIKE added');
  });
});
