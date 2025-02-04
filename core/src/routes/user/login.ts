import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/login',
  [
    body('usernameOrEmail')
      .notEmpty()
      .withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { usernameOrEmail, password } = req.body;

    try {
      let user;
      if (usernameOrEmail.includes('@')) {
        user = await prisma.user.findUnique({ where: { email: usernameOrEmail } });
      } else {
        user = await prisma.user.findUnique({ where: { username: usernameOrEmail } });
      }

      if (!user) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default router;
