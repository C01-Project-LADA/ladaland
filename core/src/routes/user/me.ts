import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/me', async (req: Request, res: Response): Promise<void> => {
  if (!req.session.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        createdAt: true,
        points: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
