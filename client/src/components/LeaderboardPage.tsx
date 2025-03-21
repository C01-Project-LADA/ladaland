'use client';

import useLeaderboard from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Medal from './Medal';
import { Button } from './ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function LeaderboardPage() {
  const { leaderboard, currentUserRanking, totalUsers, loading, error } =
    useLeaderboard();

  // When there is an error showing leaderboard, show a toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="mt-6">
      {loading ? (
        <>
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5 my-3" />
          <Skeleton className="w-full h-5" />
        </>
      ) : (
        <>
          {(totalUsers || 0) >= 50 && (
            <div className="mb-5">
              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById('current-user')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                FIND MY RANKING
              </Button>
            </div>
          )}

          {leaderboard.map((user, index) => (
            <div
              key={index}
              className="flex justify-between mb-1 items-center rounded-md p-1"
              style={{
                border:
                  index + 1 === currentUserRanking
                    ? '2px solid var(--lada-secondary)'
                    : 'none',
                background:
                  index + 1 === currentUserRanking
                    ? 'rgb(237, 255, 236)'
                    : 'transparent',
              }}
              id={index + 1 === currentUserRanking ? 'current-user' : undefined}
            >
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
          ))}
        </>
      )}
    </div>
  );
}
