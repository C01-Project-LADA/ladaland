import request from 'supertest';
import express from 'express';
import session from 'express-session';
import loginRoute from '../../src/routes/user/login';

jest.mock('@prisma/client', () => {
  const mUser = {
    findUnique: jest.fn(),
  };
  const mPrismaClient = jest.fn(() => ({
    user: mUser,
  }));
  return { PrismaClient: mPrismaClient };
});

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

import { PrismaClient } from '@prisma/client';
const mockedPrisma = new PrismaClient();
const findUniqueMock = mockedPrisma.user.findUnique as jest.Mock;

import bcrypt from 'bcrypt';
const compareMock = bcrypt.compare as jest.Mock;

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use('/api', loginRoute);

describe('POST /api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error for missing fields', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('should return invalid credentials if user is not found', async () => {
    findUniqueMock.mockResolvedValueOnce(null);
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'nonexistentUser', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should return invalid credentials if password does not match', async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedpassword',
    });
    compareMock.mockResolvedValueOnce(false);
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'testUser', password: 'wrongpassword' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should login successfully if credentials are valid (with username)', async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedpassword',
    });
    compareMock.mockResolvedValueOnce(true);
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'testUser', password: 'correctpassword' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  it('should login successfully if credentials are valid (with email)', async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: 2,
      username: 'anotherUser',
      email: 'test2@example.com',
      password: 'hashedpassword',
    });
    compareMock.mockResolvedValueOnce(true);
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'test2@example.com', password: 'correctpassword' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });
});
