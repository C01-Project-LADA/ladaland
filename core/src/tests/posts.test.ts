import request from 'supertest';
import express from 'express';
import session from 'express-session';
import postsRoute from '../../src/routes/posts';
import { PrismaClient } from '@prisma/client';

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

app.use('/api/posts', postsRoute);

describe('Test Posts', () => {
  it('should return 401 when POST /api/posts is called without authentication', async () => {
    const res = await request(app).post('/api/posts').send({
      country: 'USA',
      content: 'Hello world',
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized.');
  });

  it('should create a post successfully when authenticated', async () => {
    const fakePost = {
      id: 'post1',
      userId: '1',
      country: 'USA',
      content: 'Hello world',
      images: [],
      tags: [],
    };

    PrismaClient.prototype.$transaction = jest.fn().mockResolvedValue([fakePost, {}]);

    const agent = request.agent(app);
    await agent.get('/set-session');
    const res = await agent.post('/api/posts').send({
      country: 'USA',
      content: 'Hello world',
      tags: [],
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      ...fakePost,
      pointsAwarded: 20,
    });
  });
});
