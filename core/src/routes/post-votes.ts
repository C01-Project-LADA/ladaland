import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/:postId', async (req: Request, res: Response): Promise<void> => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = req.session.user.id;
  const { postId } = req.params;
  const { voteType } = req.body;

  if (!['LIKE', 'DISLIKE'].includes(voteType)) {
    res
      .status(400)
      .json({ error: "Invalid vote type. Must be 'LIKE' or 'DISLIKE'." });
    return;
  }

  try {
    const existingVote = await prisma.postVote.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await prisma.postVote.delete({ where: { id: existingVote.id } });
        res.status(200).json({ message: `${voteType} removed` });
      } else {
        await prisma.postVote.update({
          where: { id: existingVote.id },
          data: { type: voteType },
        });
        res.status(200).json({ message: `Vote changed to ${voteType}` });
      }
    } else {
      await prisma.postVote.create({
        data: { userId, postId, type: voteType },
      });
      res.status(201).json({ message: `${voteType} added` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/:postId', async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;

  try {
    const likes = await prisma.postVote.count({
      where: { postId, type: 'LIKE' },
    });

    const dislikes = await prisma.postVote.count({
      where: { postId, type: 'DISLIKE' },
    });

    res.status(200).json({ likes, dislikes });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
