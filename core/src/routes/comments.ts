import { Router, Request, Response } from "express";
import { PrismaClient, VoteType } from "@prisma/client";
import { body, param, query } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/",
  [
    body("postId").notEmpty().withMessage("Post ID is required."),
    body("content").notEmpty().withMessage("Comment cannot be empty."),
  ],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const userId = req.session.user.id;
    const { postId, content } = req.body;

    try {
      const comment = await prisma.comment.create({
        data: { postId, userId, content },
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  }
);

router.get(
  "/:postId",
  [
    param("postId").notEmpty().withMessage("Post ID is required."),
    query("page").optional().isInt().toInt(),
    query("sort").optional().isString(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const { page = 1, sort = "recent" } = req.query;
    const pageSize = 10;
    const skip = (Number(page) - 1) * pageSize;

    let orderBy: any;
    if (sort === "most_liked") orderBy = { commentVotes: { _count: "desc" } };
    else if (sort === "most_disliked") orderBy = { commentVotes: { _count: "asc" } };
    else orderBy = { createdAt: "desc" };

    try {
      const comments = await prisma.comment.findMany({
        where: { postId },
        include: {
          user: { select: { username: true } },
          commentVotes: true,
        },
        orderBy,
        skip,
        take: pageSize,
      });

      const formattedComments = comments.map((comment) => {
        const likes = comment.commentVotes.filter((vote) => vote.type === "LIKE").length;
        const dislikes = comment.commentVotes.filter((vote) => vote.type === "DISLIKE").length;

        return {
          id: comment.id,
          postId: comment.postId,
          userId: comment.userId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          username: comment.user.username,
          likes,
          dislikes,
        };
      });

      res.status(200).json(formattedComments);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  }
);

router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("Comment ID is required.")],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const userId = req.session.user.id;
    const { id } = req.params;

    try {
      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        res.status(404).json({ error: "Comment not found." });
        return;
      }

      if (comment.userId !== userId) {
        res.status(403).json({ error: "You can only delete your own comments." });
        return;
      }

      await prisma.comment.delete({ where: { id } });

      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  }
);

export default router;