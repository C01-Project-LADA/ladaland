import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, param, query } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  '/',
  [
    body('country')
      .notEmpty()
      .withMessage('Please select a country for this post before submitting.'),
    body('content')
      .notEmpty()
      .withMessage('Please input content for this post before submitting.'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags should be an array of strings.'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const userId = req.session.user.id;
    const { country, content, images, tags } = req.body;

    try {
      const [post] = await prisma.$transaction([
        prisma.post.create({
          data: { userId, country, content, images, tags: tags || [] },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { points: { increment: 20 } },
        }),
      ]);

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  }
);

router.delete(
  '/:id',
  [param('id').notEmpty().withMessage('Post ID is required')],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const userId = req.session.user.id;
    const { id } = req.params;

    try {
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        res.status(404).json({ error: 'Post not found.' });
        return;
      }

      if (existingPost.userId !== userId) {
        res.status(403).json({ error: 'You can only delete your own posts.' });
        return;
      }

      await prisma.$transaction([
        prisma.post.delete({
          where: { id },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { points: { decrement: 20 } },
        }),
      ]);

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  }
);

router.get(
  "/",
  query("q").optional().isString(),
  async (req: Request, res: Response): Promise<void> => {
    const { q } = req.query;

    try {
      const posts = await prisma.post.findMany({
        where: q
          ? {
              OR: [
                { country: { contains: q as string, mode: "insensitive" } },
                { tags: { has: q as string } },
              ],
            }
          : {},
        include: {
          user: { select: { username: true } },
          postVotes: true,
        },
      });

      if (!posts.length && q) {
        res.status(404).json({ message: "No posts found with this tag. Try a different search." });
        return;
      }

      const formattedPosts = posts.map((post) => {
        const likes = post.postVotes.filter((vote) => vote.type === "LIKE").length;
        const dislikes = post.postVotes.filter((vote) => vote.type === "DISLIKE").length;

        return {
          id: post.id,
          userId: post.userId,
          country: post.country,
          content: post.content,
          images: post.images,
          tags: post.tags,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          username: post.user.username,
          likes,
          dislikes,
        };
      });

      res.status(200).json(formattedPosts);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;

//LADA-61