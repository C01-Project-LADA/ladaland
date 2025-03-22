import request from 'supertest';
import express from 'express';
import session from 'express-session';
import logoutRoute from '../../src/routes/user/logout';

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

app.get('/set-session-error', (req, res) => {
  req.session.user = { id: '2', username: 'errorUser', email: 'error@example.com' };
  (req.session as any).destroy = (cb: (err: any) => void) => {
    cb(new Error('Simulated destroy error'));
  };
  res.status(200).json({ message: 'Session set with destroy error' });
});

app.use('/api', logoutRoute);

describe('POST /api/logout', () => {
  it('should return 401 if not logged in', async () => {
    const agent = request.agent(app);
    const res = await agent.post('/api/logout');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('You are not logged in.');
  });

  it('should logout successfully when user is logged in', async () => {
    const agent = request.agent(app);
    await agent.get('/set-session');
    const res = await agent.post('/api/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logout successful');
    expect(res.headers['set-cookie'][0]).toMatch(/connect\.sid=;/);
  });
});
