import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, param } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/",
  [
    body("country").notEmpty().withMessage("Please select a country for this post before submitting."),
    body("content").notEmpty().withMessage("Please input content for this post before submitting."),
  ],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const userId = req.session.user.id;
    const { country, content, images } = req.body;

    try {
      const post = await prisma.post.create({
        data: { userId, country, content, images },
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  }
);

router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("Post ID is required")],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const userId = req.session.user.id;
    const { id } = req.params;

    try {
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        res.status(404).json({ error: "Post not found." });
        return;
      }

      if (existingPost.userId !== userId) {
        res.status(403).json({ error: "You can only delete your own posts." });
        return;
      }

      await prisma.post.delete({
        where: { id },
      });

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  }
);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: { select: { username: true } } },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
