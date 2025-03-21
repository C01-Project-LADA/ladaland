'use client';

import useLeaderboard from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardPage() {
  const {
    leaderboard,
    currentUserRanking,
    totalUsers,
    loading,
    error,
    refresh: fetchLeaderboard,
  } = useLeaderboard();

  return (
    <div className="mt-7">
      {loading ? (
        <>
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5 my-3" />
          <Skeleton className="w-full h-5" />
        </>
      ) : (
        leaderboard.map((user, index) => (
          <div key={index} className="flex justify-between">
            <p>{user.username}</p>
            <p>{user.visitedCount}</p>
            <p>{user.points}</p>
          </div>
        ))
      )}
    </div>
  );
}
