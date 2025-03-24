import request from 'supertest';
import app from '../app';

describe('Express App', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/non-existing-route');
    expect(res.status).toBe(404);
  });

  it('should include CORS headers in the response', async () => {
    const res = await request(app).get('/non-existing-route');
    expect(res.headers['access-control-allow-origin']).toBe(
      'https://ladaland.com'
    );
  });
});
