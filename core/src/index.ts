import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Core server is running on http://0.0.0.0:${port}`);
});
