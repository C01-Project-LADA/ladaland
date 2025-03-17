/* eslint-disable @typescript-eslint/no-unused-vars */

type Post = {
  userVote: string;
  id: string;
  userId: string;
  /**
   * ISO 2-letter country code
   */
  country: string;
  content: string;
  // images: string[];
  createdAt: Date;
  updatedAt: Date;
  username: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
};

type PostComment = {
  userVote: string | null;
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  likes: number;
  dislikes: number;
};
