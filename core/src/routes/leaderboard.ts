import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/leaderboard', async (req: Request, res: Response): Promise<void> => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
    return;
  }

  const sortOption = (req.query.sort as string) || 'countries';
  const currentUserId = req.session.user.id;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        visitedCountries: true,
        points: true,
      },
    });

    const usersWithVisitedCount = users.map(user => {
      const visitedCount = user.visitedCountries && user.visitedCountries.trim() !== ''
        ? user.visitedCountries.split(',').filter(country => country.trim() !== '').length
        : 0;
      return { ...user, visitedCount };
    });

    let sortedUsers;
    if (sortOption === 'points') {
      sortedUsers = usersWithVisitedCount.sort((a, b) => b.points - a.points);
    } else {
      sortedUsers = usersWithVisitedCount.sort((a, b) => b.visitedCount - a.visitedCount);
    }

    const currentUserRanking = sortedUsers.findIndex(user => user.id === currentUserId) + 1;
    const totalUsers = sortedUsers.length;

    res.status(200).json({
      leaderboard: sortedUsers,
      currentUserRanking,
      totalUsers,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Error fetching leaderboard.' });
  }
});

export default router;