import { Router, Request, Response } from 'express';
import { PrismaClient, VoteType } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

async function updatePointsForComment(commentId: string) {
  const threshold = 5;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) return;

  const totalLikes = await prisma.commentVote.count({
    where: { commentId, type: VoteType.LIKE },
  });

  const newAward = Math.floor(totalLikes / threshold);

  const user = await prisma.user.findUnique({ where: { id: comment.userId } });

  if (user) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: newAward } },
      }),
    ]);
  }
}

router.post(
  '/:commentId',
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = req.session.user.id;
    const { commentId } = req.params;
    const { voteType } = req.body;

    if (!['LIKE', 'DISLIKE'].includes(voteType)) {
      res
        .status(400)
        .json({ error: "Invalid vote type. Must be 'LIKE' or 'DISLIKE'." });
      return;
    }

    try {
      const existingVote = await prisma.commentVote.findUnique({
        where: { userId_commentId: { userId, commentId } },
      });

      if (existingVote) {
        if (existingVote.type === voteType) {
          await prisma.commentVote.delete({ where: { id: existingVote.id } });
          res.status(200).json({ message: `${voteType} removed` });
        } else {
          await prisma.commentVote.update({
            where: { id: existingVote.id },
            data: { type: voteType },
          });
          await updatePointsForComment(commentId);
          res.status(200).json({ message: `Vote changed to ${voteType}` });
        }
      } else {
        await prisma.commentVote.create({
          data: { userId, commentId, type: voteType },
        });
        await updatePointsForComment(commentId);
        res.status(201).json({ message: `${voteType} added` });
      }
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
);

// Should not need this for the time being
router.get(
  '/:commentId',
  async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;

    try {
      const likes = await prisma.commentVote.count({
        where: { commentId, type: 'LIKE' },
      });

      const dislikes = await prisma.commentVote.count({
        where: { commentId, type: 'DISLIKE' },
      });

      res.status(200).json({ likes, dislikes });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
);

export default router;
