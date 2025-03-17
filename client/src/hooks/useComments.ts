import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useComments(postId: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  /**
   * Loading only true for the first render
   */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:4000/api/comments/${postId}`,
        {
          withCredentials: true,
        }
      );

      const formattedComments: PostComment[] = response.data.map(
        (comment: PostComment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt),
        })
      );

      setComments(formattedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refresh: fetchComments };
}
