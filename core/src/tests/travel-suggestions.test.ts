const createMock = jest.fn();

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: createMock,
      },
    },
  })),
}));

import request from 'supertest';
import express from 'express';
import session from 'express-session';
import travelSuggestionsRoute from '../../src/routes/travel-suggestions';

describe('Travel Suggestions Route', () => {
  let app: express.Express;
  let agent: ReturnType<typeof request.agent>;

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

    app.use('/api', travelSuggestionsRoute);
    agent = request.agent(app);
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app)
      .post('/api/travel-suggestions')
      .send({ budget: '100', country: 'Canada' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not authenticated');
  });

  it('should return travel suggestions for a valid request', async () => {
    await agent.get('/set-session');

    const fakeSuggestions = JSON.stringify([
      {
        destination: 'Test Attraction',
        reason: 'Affordable and fun',
        cost: 100,
        purchaseOption: 'no purchasing options available',
      },
    ]);

    createMock.mockResolvedValueOnce({
      choices: [
        {
          message: { content: fakeSuggestions },
        },
      ],
    });

    const res = await agent
      .post('/api/travel-suggestions')
      .send({ budget: '100', country: 'Canada' });

    expect(res.status).toBe(200);
    expect(res.body.suggestions).toEqual(JSON.parse(fakeSuggestions));
  });
});
