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
    const userPromise = prisma.user.findUnique({
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

    const postsCountPromise = prisma.post.count({
      where: { userId: req.session.user.id },
    });

    const postLikesPromise = prisma.postVote.count({
      where: {
        type: 'LIKE',
        post: { userId: req.session.user.id },
      },
    });

    const commentLikesPromise = prisma.commentVote.count({
      where: {
        type: 'LIKE',
        comment: { userId: req.session.user.id },
      },
    });

    const tripsCountPromise = prisma.trip.count({
      where: { userId: req.session.user.id },
    });

    const [user, postsCount, postLikes, commentLikes, tripsCount] =
      await Promise.all([
        userPromise,
        postsCountPromise,
        postLikesPromise,
        commentLikesPromise,
        tripsCountPromise,
      ]);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const totalLikes = postLikes + commentLikes;

    res.status(200).json({
      user,
      postsCount,
      totalLikes,
      tripsCount,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
