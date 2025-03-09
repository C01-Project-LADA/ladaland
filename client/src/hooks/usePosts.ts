import { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  /**
   * Loading only true for the first render
   */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPosts() {
    setError(null);

    try {
      const response = await axios.get('http://localhost:4000/api/posts', {
        withCredentials: true,
      });

      const formattedPosts = response.data.map((post: Post) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));

      setPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refresh: fetchPosts };
}
