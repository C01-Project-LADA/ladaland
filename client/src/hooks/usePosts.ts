import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '@/envConfig'

const url = process.env.API_URL;

export default function usePosts(id?: string, query?: string, sortBy?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const fetchPosts = useCallback(
    async (pageToFetch: number) => {
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('q', query.substring(0, 2));
        if (sortBy) queryParams.append('sortBy', sortBy);
        queryParams.append('page', String(pageToFetch));
        queryParams.append('pageSize', String(pageSize));

        const response = await axios.get(
          `${url}/posts${id ? `/${id}` : ''}?${queryParams.toString()}`,
          { withCredentials: true }
        );

        const newPosts = Array.isArray(response.data)
          ? response.data.map((post: Post) => ({
              ...post,
              createdAt: new Date(post.createdAt),
              updatedAt: new Date(post.updatedAt),
            }))
          : [
              {
                ...response.data,
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt),
              },
            ];

        if (newPosts.length < pageSize) {
          setHasMore(false);
        }

        setPosts((prev) => {
          const combined = [...prev, ...newPosts];
          const deduped = Array.from(
            new Map(combined.map((post) => [post.id, post])).values()
          );
          return deduped;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    },
    [id, query, sortBy]
  );

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchPosts(1);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  }, [page, fetchPosts, loading, hasMore]);

  return {
    posts,
    loading,
    error,
    refresh: () => {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      fetchPosts(1);
    },
    loadMore,
    hasMore,
  };
}
