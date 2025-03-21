'use client';

import styles from '@/styles/Dashboard.module.css';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import useUser from '@/hooks/useUser';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import useLeaderboard from '@/hooks/useLeaderboard';
import Medal from '@/components/Medal';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [postSearch, setPostSearch] = useState('');
  const [postSortBy, setPostSortBy] = useState<string | null>('');

  const { leaderboard, currentUserRanking, totalUsers, loading } =
    useLeaderboard();

  const { user, refresh: refreshUser } = useUser();
  const currentPoints = user?.points || 0;

  const level = Math.floor(currentPoints / 1000) + 1;

  const startXp = (level - 1) * 1000;
  const endXp = level * 1000;

  let progress = 0;
  if (endXp > startXp) {
    progress = ((currentPoints - startXp) / (endXp - startXp)) * 100;
  }

  // Let sidebar scroll with the page
  useEffect(() => {
    function onscroll() {
      if (sidebarRef.current && contentRef.current) {
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;
        const viewportHeight = window.innerHeight;
        const contentHeight =
          contentRef.current?.getBoundingClientRect().height;

        if (scrollTop >= contentHeight - viewportHeight + 30) {
          // contentRef.current.style.transform = `translateY(-${
          //   contentHeight - viewportHeight + 30
          // }px)`;
          console.log(scrollTop, contentHeight, viewportHeight);
          contentRef.current.style.transform = `translateY(${scrollTop}px)`;
          // sidebarRef.current.style.transform = `translateY(${Math.min(
          //   contentHeight,
          //   scrollTop - (contentHeight - viewportHeight + 30)
          // )}px)`;
          contentRef.current.style.transform = `translateX(${-scrollLeft}px)`;
          contentRef.current.style.position = 'fixed';
        } else {
          contentRef.current.style.transform = '';
          // sidebarRef.current.style.transform = '';
          contentRef.current.style.position = '';
        }
      }
    }
    // window.addEventListener('scroll', onscroll);

    return () => {
      window.removeEventListener('scroll', onscroll);
    };
  }, []);

  function pushRouterWithQuery(query: string) {
    const linkWithoutQuery = pathname.split('?')[0];
    const urlParams = new URLSearchParams(window.location.search);

    const [key, value] = query.split('=');
    urlParams.set(key, value);

    router.push(`${linkWithoutQuery}?${urlParams.toString()}`);
  }

  useEffect(() => {
    const handleUserPointsUpdate = async () => {
      await refreshUser();
    };

    window.addEventListener('userPointsUpdated', handleUserPointsUpdate);
    return () => {
      window.removeEventListener('userPointsUpdated', handleUserPointsUpdate);
    };
  }, [refreshUser]);

  return (
    <div className={styles.container} ref={sidebarRef}>
      <div className={styles.content} ref={contentRef}>
        <div className={styles.sidebar_content_container}>
          <div className={styles.top_stats}>
            <div className={styles.levels}>
              <div className="flex items-end justify-between w-full mb-[4px]">
                <p className={styles.level_title}>Level {level}</p>
                <p className={styles.level_current}>
                  {currentPoints.toLocaleString()} points
                </p>
              </div>
              <Progress value={progress} />

              <div className="flex justify-between w-full">
                <p className={styles.level_num}>{startXp.toLocaleString()}</p>
                <p className={styles.level_num}>{endXp.toLocaleString()}</p>
              </div>
            </div>

            <Avatar>
              <AvatarImage alt={`@${user?.username}`} />
              <AvatarFallback title={user?.username}>
                {user?.username[0].toUpperCase() || ''}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className={styles.bottom_stats}>
            <div className={styles.stats}>
              <div className="w-10 h-5 bg-gray-300"></div>
              <p>5</p>
            </div>
            <div className={styles.stats}>
              <div className="w-10 h-5 bg-gray-300"></div>
              <p>5</p>
            </div>
            <div className={styles.stats}>
              <div className="w-10 h-5 bg-gray-300"></div>
              <p>5</p>
            </div>
          </div>
        </div>

        {pathname === '/social' && (
          <div className={`${styles.sidebar_content_container} mt-10`}>
            <h3 className="text-md font-bold mt-1">Search posts</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                pushRouterWithQuery(`q=${postSearch}`);
              }}
            >
              <Input
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                className="mt-4 text-sm"
                startIcon={Search}
                placeholder="Search for a country..."
              />
            </form>

            <Select
              value={postSortBy || ''}
              onValueChange={(value) => {
                setPostSortBy(value);
                pushRouterWithQuery(`sortBy=${value}`);
              }}
            >
              <SelectTrigger className="mt-3">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mostRecent">Most Recent</SelectItem>
                <SelectItem value="leastRecent">Least Recent</SelectItem>
                <SelectItem value="mostLiked">Most Liked</SelectItem>
                <SelectItem value="leastLiked">Least Liked</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-2 mb-2">
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  setPostSearch('');
                  setPostSortBy(null);
                  router.push('/social');
                }}
              >
                <span className="px-5">Clear</span>
              </Button>
            </div>
          </div>
        )}

        {pathname !== '/leaderboard' && (
          <div className={`${styles.sidebar_content_container} mt-5 pb-2`}>
            <h3 className="text-md font-bold mt-1 mb-3">Leaderboard</h3>

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

                {leaderboard.slice(0, 5).map((user, index) => (
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
                    id={
                      index + 1 === currentUserRanking
                        ? 'current-user'
                        : undefined
                    }
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
                      <p className="font-bold text-sm max-w-[15ch] overflow-hidden text-ellipsis">
                        {user.username}
                      </p>
                    </div>
                    <p className="text-xs">
                      {user.points} point{user.points !== 1 && 's'}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        <p className="mt-10 text-center text-sm font-semibold text-gray-400">
          © 2025 LADA LAND
        </p>
      </div>
    </div>
  );
}
