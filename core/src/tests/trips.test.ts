jest.mock('@prisma/client', () => {
  const tripMock = {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const expenseMock = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      trip: tripMock,
      expense: expenseMock,
    })),
  };
});

import request from 'supertest';
import express from 'express';
import session from 'express-session';
import tripsRoute from '../../src/routes/trips';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const tripCreateMock = prisma.trip.create as jest.Mock;
const tripFindManyMock = prisma.trip.findMany as jest.Mock;

describe('Trips Routes', () => {
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
        id: 'testUserId',
        username: 'testUser',
        email: 'test@example.com',
      };
      res.status(200).json({ message: 'Session set' });
    });

    app.use('/api/trips', tripsRoute);

    agent = request.agent(app);
  });

  describe('POST /api/trips', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).post('/api/trips').send({
        name: 'My Trip',
        startDate: '2025-01-01',
        endDate: '2025-01-10',
        budget: 1000,
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized. Please log in.');
      expect(tripCreateMock).not.toHaveBeenCalled();
    });

    it('should create a trip if data is valid and user is authenticated', async () => {
      await agent.get('/set-session');

      tripCreateMock.mockResolvedValueOnce({
        id: 'trip-id-123',
        userId: 'testUserId',
        name: 'Valid Trip',
        location: 'Test Location',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-10'),
        budget: 1000,
        completed: false,
        expenses: [],
      });

      const res = await agent.post('/api/trips').send({
        name: 'Valid Trip',
        location: 'Test Location',
        startDate: '2025-01-01',
        endDate: '2025-01-10',
        budget: 1000,
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('trip-id-123');
      expect(res.body.name).toBe('Valid Trip');
      expect(res.body.location).toBe('Test Location');
      expect(tripCreateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'testUserId',
            name: 'Valid Trip',
            location: 'Test Location',
            budget: 1000,
          }),
        })
      );
    });
  });

  describe('GET /api/trips', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/api/trips');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized. Please log in.');
    });

    it('should return a list of trips with budgetLeft when user is authenticated', async () => {
      await agent.get('/set-session');

      tripFindManyMock.mockResolvedValueOnce([
        {
          id: 'trip1',
          userId: 'testUserId',
          name: 'Trip One',
          location: 'Location One',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-05'),
          budget: 500,
          completed: false,
          expenses: [
            { id: 'exp1', type: 'Flight', name: 'Flight Ticket', cost: 200 },
            { id: 'exp2', type: 'Food', name: 'Lunch', cost: 50 },
          ],
        },
        {
          id: 'trip2',
          userId: 'testUserId',
          name: 'Trip Two',
          location: 'Location Two',
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-02-07'),
          budget: 1200,
          completed: true,
          expenses: [
            { id: 'exp3', type: 'Hotel', name: 'Hotel Stay', cost: 300 },
            { id: 'exp4', type: 'Activity', name: 'Tour', cost: 100 },
          ],
        },
      ]);

      const res = await agent.get('/api/trips');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);

      const [tripOne, tripTwo] = res.body;
      expect(tripOne.budgetLeft).toBe(500 - (200 + 50));
      expect(tripTwo.budgetLeft).toBe(1200 - (300 + 100));
    });
  });
});
