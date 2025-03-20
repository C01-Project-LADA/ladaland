import { Router, Request, Response } from 'express';
import { PrismaClient, VoteType } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

async function updatePointsForPost(postId: string) {
  const threshold = 5;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!post) return;

  const totalLikes = await prisma.postVote.count({
    where: { postId, type: VoteType.LIKE },
  });

  const newAward = Math.floor(totalLikes / threshold);

  const diff = newAward - post.pointsAwarded;

  if (diff !== 0) {
    await prisma.$transaction([
      prisma.post.update({
        where: { id: postId },
        data: { pointsAwarded: newAward },
      }),
      prisma.user.update({
        where: { id: post.userId },
        data: { points: { increment: diff } },
      }),
    ]);
  }
}

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
        await updatePointsForPost(postId);
        res.status(200).json({ message: `Vote changed to ${voteType}` });
      }
    } else {
      await prisma.postVote.create({
        data: { userId, postId, type: voteType },
      });
      await updatePointsForPost(postId);
      res.status(201).json({ message: `${voteType} added` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// For the time being, we probably don't need this route
router.get('/:postId', async (req: Request, res: Response): Promise<void> => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = req.session.user.id;
  const { postId } = req.params;

  try {
    const postVotes = await prisma.postVote.findMany({
      where: { postId },
      select: { userId: true, type: true },
    });

    const likes = postVotes.filter(vote => vote.type === 'LIKE').length;
    const dislikes = postVotes.filter(vote => vote.type === 'DISLIKE').length;
    const userVote = postVotes.find(vote => vote.userId === userId)?.type || null;

    res.status(200).json({ likes, dislikes, userVote });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;