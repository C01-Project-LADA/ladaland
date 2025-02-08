import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// As of 2025, there are 195 recognized countries in the world according to the United Nations
const TOTAL_COUNTRIES = 195;

router.get(
  '/visitedCountriesPercent',
  async (req: Request, res: Response): Promise<void> => {
    /* const { userId } = req.query;           // TODO: implement proper user authentication

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      } 

      const visitedCountries = user.visitedCountries
        ? user.visitedCountries.split(',')
        : []; 

      const visitedCount = visitedCountries.length; */
      try {       // remove line
      let visitedCount = 0;     // remove line
      const percentage = ((visitedCount / TOTAL_COUNTRIES) * 100).toFixed(2);

      res.status(200).json({
        visitedCount,
        percentage: `${percentage}%`,
        message: `You have visited ${visitedCount}/${TOTAL_COUNTRIES} countries, which is ${percentage}% of the world!`,
      });
    } catch (error) {
      console.error('Error fetching visited percentage:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default router;
