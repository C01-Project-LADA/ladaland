import request from 'supertest';
import express from 'express';
import session from 'express-session';
import commentVotesRoute from '../../src/routes/comment-votes';

jest.mock('@prisma/client', () => {
  const mCommentVote = {
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  };
  const mComment = {
    findUnique: jest.fn(),
  };
  const mUser = {
    findUnique: jest.fn(),
    update: jest.fn(),
  };
  const mTransaction = jest.fn();
  const mPrismaClient = jest.fn(() => ({
    commentVote: mCommentVote,
    comment: mComment,
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
const commentVoteFindUniqueMock = prisma.commentVote.findUnique as jest.Mock;
const commentVoteCreateMock = prisma.commentVote.create as jest.Mock;
const commentVoteCountMock = prisma.commentVote.count as jest.Mock;
const commentFindUniqueMock = prisma.comment.findUnique as jest.Mock;
const userFindUniqueMock = prisma.user.findUnique as jest.Mock;
const transactionMock = prisma.$transaction as jest.Mock;

describe('Comment Votes Routes', () => {
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

    app.use('/api/comment-votes', commentVotesRoute);
  });

  it('should return 401 if not authenticated when POST /api/comment-votes/:commentId is called', async () => {
    const res = await request(app)
      .post('/api/comment-votes/comment1')
      .send({ voteType: 'LIKE' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should add a new vote and update points when POST /api/comment-votes/:commentId is called and no vote exists', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    commentVoteFindUniqueMock.mockResolvedValueOnce(null);

    commentVoteCreateMock.mockResolvedValueOnce({
      id: 'cvote1',
      userId: sessionUser.id,
      commentId: 'comment1',
      type: VoteType.LIKE,
    });

    commentFindUniqueMock.mockResolvedValueOnce({
      id: 'comment1',
      userId: '2',
    });
    commentVoteCountMock.mockResolvedValueOnce(5);
    userFindUniqueMock.mockResolvedValueOnce({ id: '2', points: 10 });
    transactionMock.mockResolvedValueOnce([{}]);

    const res = await agent
      .post('/api/comment-votes/comment1')
      .send({ voteType: 'LIKE' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('LIKE added');
  });

  it('should return the correct like and dislike counts when GET /api/comment-votes/:commentId is called', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');

    commentVoteCountMock
      .mockResolvedValueOnce(3) //LIKE count.
      .mockResolvedValueOnce(1); //DISLIKE count.

    const res = await agent.get('/api/comment-votes/comment1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ likes: 3, dislikes: 1 });
  });
});
