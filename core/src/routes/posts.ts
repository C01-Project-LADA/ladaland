import { Router, Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { body, param, query } from 'express-validator';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';

const router = Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

const storageClient = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEYFILE,
});
const bucket = storageClient.bucket(process.env.GCLOUD_STORAGE_BUCKET!);

router.post(
  '/',
  upload.single('image'),
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
    const { country, content, tags } = req.body;
    let imageUrl: string | undefined = undefined;

    if (req.file) {
      const fileData = req.file;
      const filename = `${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(filename);

      try {
        await new Promise<void>((resolve, reject) => {
          const stream = file.createWriteStream({
            resumable: false,
            metadata: { contentType: req.file!.mimetype },
          });

          stream.on('error', (err) => {
            console.error('Error uploading file:', err);
            reject(err);
          });

          stream.on('finish', () => {
            imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            resolve();
          });

          stream.end(fileData.buffer);
        });
      } catch (error) {
        res.status(500).json({ error: 'Error uploading file.' });
        return;
      }
    }

    try {
      const [post] = await prisma.$transaction([
        prisma.post.create({
          data: {
            userId,
            country,
            content,
            imageUrl,
            tags: tags || [],
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { points: { increment: 20 } },
        }),
      ]);

      res.status(201).json({
        ...post,
        pointsAwarded: 20,
      });
    } catch (error) {
      console.error('Error creating post:', error);
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
  '/',
  [
    query('q').optional().isString(),
    query('page').optional().isInt().toInt(),
    query('pageSize').optional().isInt().toInt(),
    query('sortBy').optional().isString(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const { q, sortBy } = req.query;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const userId = req.session?.user?.id;

    try {
      const orderByClause: Prisma.PostOrderByWithRelationInput | undefined =
        sortBy === 'mostRecent'
          ? { createdAt: 'desc' as Prisma.SortOrder }
          : sortBy === 'leastRecent'
            ? { createdAt: 'asc' as Prisma.SortOrder }
            : undefined;

      const posts = await prisma.post.findMany({
        where: q
          ? {
              OR: [
                { country: { contains: q as string, mode: 'insensitive' } },
                { tags: { has: q as string } },
                { content: { contains: q as string, mode: 'insensitive' } },
              ],
            }
          : {},
        include: {
          user: { select: { username: true } },
          postVotes: true,
          comments: true,
        },
        orderBy: orderByClause || { createdAt: 'desc' as Prisma.SortOrder },
        skip,
        take: pageSize,
      });

      const formattedPosts = posts.map((post) => {
        const likes = post.postVotes.filter(
          (vote) => vote.type === 'LIKE'
        ).length;
        const dislikes = post.postVotes.filter(
          (vote) => vote.type === 'DISLIKE'
        ).length;
        const userVote = post.postVotes.find(
          (vote) => vote.userId === userId
        )?.type;
        const commentsCount = post.comments.length;

        return {
          id: post.id,
          userId: post.userId,
          country: post.country,
          content: post.content,
          imageUrl: post.imageUrl,
          tags: post.tags,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          username: post.user.username,
          likes,
          dislikes,
          userVote: userVote || null,
          commentsCount,
        };
      });

      if (sortBy === 'mostLiked') {
        formattedPosts.sort((a, b) => b.likes - a.likes);
      } else if (sortBy === 'leastLiked') {
        formattedPosts.sort((a, b) => a.likes - b.likes);
      }

      res.status(200).json(formattedPosts);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
);

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.session?.user?.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { username: true } },
        postVotes: true,
        comments: true,
      },
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }

    const likes = post.postVotes.filter((vote) => vote.type === 'LIKE').length;
    const dislikes = post.postVotes.filter(
      (vote) => vote.type === 'DISLIKE'
    ).length;
    const userVote = post.postVotes.find(
      (vote) => vote.userId === userId
    )?.type;
    const commentsCount = post.comments.length;

    const formattedPost = {
      id: post.id,
      userId: post.userId,
      country: post.country,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      username: post.user.username,
      likes,
      dislikes,
      userVote: userVote || null,
      commentsCount,
    };

    res.status(200).json(formattedPost);
  } catch (error) {
    console.error('Post error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
