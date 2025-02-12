'use client';

import styles from '@/styles/Dashboard.module.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Let sidebar scroll with the page
  useEffect(() => {
    function onscroll() {
      if (sidebarRef.current && contentRef.current) {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const contentHeight =
          contentRef.current?.getBoundingClientRect().height;

        if (scrollTop >= contentHeight - viewportHeight + 30) {
          contentRef.current.style.transform = `translateY(-${
            contentHeight - viewportHeight + 30
          }px)`;
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
        <Link href="/profile">
          <div className={styles.profile_container}>
            <div className={styles.top_stats}>
              <div className={styles.levels}>
                <p>1531 / 5000</p>
                <Progress value={20} />
                <p>Lv. 5 Explorer</p>
              </div>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>

            <div className={styles.bottom_stats}>
              <div className={styles.stat}></div>
              <div className={styles.stat}></div>
              <div className={styles.stat}></div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
