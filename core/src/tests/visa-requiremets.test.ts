import request from 'supertest';
import express from 'express';
import session from 'express-session';
import visaRequirementsRoute from '../../src/routes/visa-requirements';

jest.mock('@prisma/client', () => {
  const mVisaRequirement = {
    findMany: jest.fn(),
  };
  const mPrismaClient = jest.fn(() => ({
    visaRequirement: mVisaRequirement,
  }));
  return { PrismaClient: mPrismaClient };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const findManyMock = prisma.visaRequirement.findMany as jest.Mock;

describe('Visa Requirements Route', () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api', visaRequirementsRoute);
  });

  it('should return 400 if passports array is missing/empty', async () => {
    const res = await request(app)
      .post('/api/visa-requirements')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Passports must be provided as a non-empty array.');

    const res2 = await request(app)
      .post('/api/visa-requirements')
      .send({ passports: [] });
    expect(res2.status).toBe(400);
    expect(res2.body.error).toBe('Passports must be provided as a non-empty array.');
  });

  it('should return the best visa requirement options for each destination', async () => {
    const visaRows = [
      { destination: 'France', passport: 'USA', requirement: 'visa free' },
      { destination: 'France', passport: 'USA', requirement: '30' },
      { destination: 'Germany', passport: 'USA', requirement: 'visa on arrival' },
    ];
    findManyMock.mockResolvedValueOnce(visaRows);

    const res = await request(app)
      .post('/api/visa-requirements')
      .send({ passports: ['USA'] });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body).toEqual(
      expect.arrayContaining([
        { destination: 'France', requirement: '30', passport: 'USA' },
        { destination: 'Germany', requirement: 'visa on arrival', passport: 'USA' },
      ])
    );
  });
});
