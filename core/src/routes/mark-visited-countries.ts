import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/markVisitedCountries',
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized. Please log in.' });
      return;
    }

    const userId = req.session.user.id;

    // countryCode is the short form for a country, for ex., US, CA
    const { countryCode, action } = req.body;

    if (!countryCode || !['add', 'remove'].includes(action)) {
      res.status(400).json({
        error:
          'Invalid request. Provide a countryCode and action (add or remove).',
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { visitedCountries: true },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      let visitedCountries = user.visitedCountries
        ? user.visitedCountries.split(',')
        : [];

      if (action === 'add' && !visitedCountries.includes(countryCode)) {
        visitedCountries.push(countryCode);
      } else if (
        action === 'remove' &&
        visitedCountries.includes(countryCode)
      ) {
        visitedCountries = visitedCountries.filter(
          (country) => country !== countryCode
        );
      }

      await prisma.user.update({
        where: { id: userId },
        data: { visitedCountries: visitedCountries.join(',') },
      });

      res.status(200).json({
        message: `Country ${countryCode} has been ${action === 'add' ? 'added to' : 'removed from'} your visited countries.`,
        visitedCountries,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error adding/removing countries' });
    }
  }
);

router.get('/getVisitedCountries', async (req: Request, res: Response) => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
    return;
  }

  const userId = req.session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { visitedCountries: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      visitedCountries: user.visitedCountries
        ? user.visitedCountries.split(',')
        : [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving visited countries' });
  }
});

export default router;
