import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function usePosts(id?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  /**
   * Loading only true for the first render
   */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:4000/api/posts/${id || ''}`,
        {
          withCredentials: true,
        }
      );

      const formattedPosts = Array.isArray(response.data)
        ? response.data.map((post: Post) => ({
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
          }))
        : [
            {
              ...(response.data as Post),
              createdAt: new Date(response.data.createdAt),
              updatedAt: new Date(response.data.updatedAt),
            },
          ];

      setPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refresh: fetchPosts };
}
