/* eslint-disable @typescript-eslint/no-unused-vars */

type Post = {
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
};
