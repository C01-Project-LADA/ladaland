import request from 'supertest';
import express from 'express';
import session from 'express-session';
import registerRoute from '../../src/routes/user/register';

jest.mock('@prisma/client', () => {
  const mUser = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };
  const mPrismaClient = jest.fn(() => ({
    user: mUser,
  }));
  return { PrismaClient: mPrismaClient };
});

import { PrismaClient } from '@prisma/client';
const mockedPrisma = new PrismaClient();

const findUniqueMock = mockedPrisma.user.findUnique as jest.Mock;
const createMock = mockedPrisma.user.create as jest.Mock;

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use('/api', registerRoute);

describe('POST /api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return validation errors for invalid input', async () => {
    const res = await request(app).post('/api/register').send({
      username: '',
      email: 'not-an-email',
      password: 'short',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return an error if the username already exists', async () => {
    findUniqueMock.mockResolvedValueOnce({ id: 1, username: 'existingUser' });

    const res = await request(app).post('/api/register').send({
      username: 'existingUser',
      email: 'newemail@example.com',
      password: 'validpassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      'Username is already taken. Please choose another one.'
    );
  });

  it('should return an error if the email already exists', async () => {
    findUniqueMock.mockResolvedValueOnce(null);
    findUniqueMock.mockResolvedValueOnce({
      id: 2,
      email: 'existing@example.com',
    });

    const res = await request(app).post('/api/register').send({
      username: 'newUser',
      email: 'existing@example.com',
      password: 'validpassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email is already registered. Please log in.');
  });

  it('should register a new user successfully', async () => {
    findUniqueMock.mockResolvedValueOnce(null); //username
    findUniqueMock.mockResolvedValueOnce(null); //email
    createMock.mockResolvedValue({
      id: 3,
      username: 'newUser',
      email: 'newuser@example.com',
    });

    const res = await request(app).post('/api/register').send({
      username: 'newUser',
      email: 'newuser@example.com',
      password: 'validpassword',
      phone: '1234567890',
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe(
      'User registered and logged in successfully.'
    );
  });
});
