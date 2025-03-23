import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '@/envConfig'

const url = process.env.API_URL;

export default function useComments(postId: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const fetchComments = useCallback(
    async (pageToFetch: number) => {
      setError(null);
      setLoading(true);

      try {
        const response = await axios.get(
          `${url}/comments/${postId}?page=${pageToFetch}`,
          { withCredentials: true }
        );

        const newComments: PostComment[] = response.data.map(
          (comment: PostComment) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
          })
        );

        setComments((prev) => {
          const combined = [...prev, ...newComments];
          const deduped = Array.from(
            new Map(combined.map((c) => [c.id, c])).values()
          );
          return deduped;
        });

        if (newComments.length < pageSize) {
          setHasMore(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch comments'
        );
      } finally {
        setLoading(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    fetchComments(1);
  }, [postId, fetchComments]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage);
    }
  }, [page, loading, hasMore, fetchComments]);

  const refresh = useCallback(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchComments(1);
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
