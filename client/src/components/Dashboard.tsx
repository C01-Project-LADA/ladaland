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

export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [postSearch, setPostSearch] = useState('');
  const [postSortBy, setPostSortBy] = useState<string | null>('');

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
          contentRef.current.style.transform = `translateY(-${
            contentHeight - viewportHeight + 30
          }px)`;
          contentRef.current.style.transform = `translateX(${-scrollLeft}px)`;
          contentRef.current.style.position = 'fixed';
        } else {
          contentRef.current.style.transform = '';
          contentRef.current.style.position = '';
        }
      }
    }
    window.addEventListener('scroll', onscroll);

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
              <p className={styles.level_title}>
                  Level {level}
                </p>
                <p className={styles.level_current}>
                  {currentPoints.toLocaleString()} points
                </p>
              </div>
              <Progress value={progress} />

              <div className="flex justify-between w-full">
                <p className={styles.level_num}>
                  {startXp.toLocaleString()}
                </p>
                <p className={styles.level_num}>
                  {endXp.toLocaleString()}
                </p>
              </div>
            </div>

            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
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
      </div>
    </div>
  );
}
