'use client';

import useLeaderboard from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Medal from './Medal';

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
          <div key={index} className="flex justify-between mb-2 items-center">
            <div className="flex gap-3 items-center">
              {index === 0 && <Medal placement="gold" />}
              {index === 1 && <Medal placement="silver" />}
              {index === 2 && <Medal placement="bronze" />}
              {index > 2 && (
                <div
                  className="w-7 scale-[0.8] text-lg flex items-center justify-center"
                  style={{
                    color: 'var(--lada-primary)',
                    filter: 'brightness(0.5)',
                  }}
                >
                  {index + 1}
                </div>
              )}
              <Avatar>
                <AvatarImage alt={`@${user.username}`} />
                <AvatarFallback title={user.username}>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold text-lg">{user.username}</p>
            </div>
            <p className="text-sm">
              {user.points} point{user.points !== 1 && 's'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
