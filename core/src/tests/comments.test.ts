import request from 'supertest';
import express from 'express';
import session from 'express-session';
import commentsRoute from '../../src/routes/comments';

jest.mock('@prisma/client', () => {
  const mComment = {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  };
  const mUser = {
    update: jest.fn(),
  };
  const mTransaction = jest.fn();
  const mPrismaClient = jest.fn(() => ({
    comment: mComment,
    user: mUser,
    $transaction: mTransaction,
  }));
  return {
    PrismaClient: mPrismaClient,
    VoteType: { LIKE: 'LIKE', DISLIKE: 'DISLIKE' },
  };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const commentFindManyMock = prisma.comment.findMany as jest.Mock;
const transactionMock = prisma.$transaction as jest.Mock;

describe('Comments Routes', () => {
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

    app.use('/api/comments', commentsRoute);
  });

  it('should create a new comment when POST /api/comments is called with valid data and authenticated user', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    const fakeComment = {
      id: 'comment1',
      postId: '123',
      userId: '1',
      content: 'Nice post!',
    };
    transactionMock.mockResolvedValueOnce([fakeComment, {}]);

    const res = await agent
      .post('/api/comments')
      .send({ postId: '123', content: 'Nice post!' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual([fakeComment, {}]);
  });

  it('should return formatted comments when GET /api/comments/:postId is called', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    const sampleComment = {
      id: 'comment1',
      postId: '123',
      userId: '1',
      content: 'Nice post!',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      user: { username: 'testUser' },
      commentVotes: [],
    };

    commentFindManyMock.mockResolvedValueOnce([sampleComment]);

    const res = await agent.get('/api/comments/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 'comment1',
        postId: '123',
        userId: '1',
        content: 'Nice post!',
        createdAt: new Date(sampleComment.createdAt).toISOString(),
        updatedAt: new Date(sampleComment.updatedAt).toISOString(),
        username: 'testUser',
        likes: 0,
        dislikes: 0,
        userVote: null,
      },
    ]);
  });
});
