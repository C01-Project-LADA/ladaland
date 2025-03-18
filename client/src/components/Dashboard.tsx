'use client';

import styles from '@/styles/Dashboard.module.css';
import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const mockData = {
  xp: 1531,
  startxp: 1000,
  endxp: 5000,
};

export default function Dashboard() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.container} ref={sidebarRef}>
      <div className={styles.content} ref={contentRef}>
        <div className={styles.profile_container}>
          <div className={styles.top_stats}>
            <div className={styles.levels}>
              <div className="flex items-end justify-between w-full mb-[4px]">
                <p className={styles.level_title}>Level 5, Explorer</p>
                <p className={styles.level_current}>
                  {mockData.xp.toLocaleString('en', { useGrouping: true })} xp
                </p>
              </div>
              <Progress value={20} />
              <div className="flex justify-between w-full">
                <p className={styles.level_num}>
                  {mockData.startxp.toLocaleString('en', { useGrouping: true })}
                </p>
                <p className={styles.level_num}>
                  {mockData.endxp.toLocaleString('en', { useGrouping: true })}
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
      </div>
    </div>
  );
}
