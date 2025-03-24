import dotenv from 'dotenv';
import http from 'http';
import app from './app';

dotenv.config();

const port = 4000;

const server = http.createServer({ keepAliveTimeout: 700_000 }, app);

server.listen(port, '0.0.0.0', () => {
  console.log(`Core server is running on http://0.0.0.0:${port}`);
});
