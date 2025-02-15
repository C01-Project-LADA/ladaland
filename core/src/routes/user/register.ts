import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password, phone } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        res
          .status(400)
          .json({
            error: 'Username is already taken. Please choose another one.',
          });
        return;
      }

      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        res
          .status(400)
          .json({ error: 'Email is already registered. Please log in.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          phone,
        },
      });

      // Log in user
      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      };

      res
        .status(201)
        .json({ message: 'User registered and logged in successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default router;
