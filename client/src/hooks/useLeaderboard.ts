import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { UserWithRanking } from '@/types/user';
import '@/envConfig'

const url = process.env.API_URL;

export default function useLeaderboard(sortBy = 'points') {
  const [leaderboard, setLeaderboard] = useState<UserWithRanking[]>([]);
  const [currentUserRanking, setCurrentUserRanking] = useState<number | null>(
    null
  );
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  /**
   * Loading only true for the first render
   */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (sortBy) queryParams.append('sort', sortBy);

      const response = await axios.get<{
        leaderboard: UserWithRanking[];
        currentUserRanking: number;
        totalUsers: number;
      }>(`${url}/leaderboard?${queryParams.toString()}`, {
        withCredentials: true,
      });

      setLeaderboard(response.data.leaderboard);
      setCurrentUserRanking(response.data.currentUserRanking);
      setTotalUsers(response.data.totalUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    currentUserRanking,
    totalUsers,
    loading,
    error,
    refresh: fetchLeaderboard,
  };
}
