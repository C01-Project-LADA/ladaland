'use client';

import styles from '@/styles/SideNavigation.module.css';
import { House, Plane, MessageCircle, Trophy, BookText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/home', text: 'Home', icon: <House /> },
  { href: '/trips', text: 'Trips', icon: <Plane /> },
  { href: '/social', text: 'Social', icon: <MessageCircle /> },
  { href: '/leaderboard', text: 'Leaderboard', icon: <Trophy /> },
  { href: '/passport-tool', text: 'Passport Tool', icon: <BookText /> },
  // TODO: Change profile to personal pfp
  {
    href: '/profile',
    text: 'Profile',
    icon: (
      <Avatar className="w-8 h-8 -ml-1 -mr-1">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="font-semibold text-gray-600">
          CN
        </AvatarFallback>
      </Avatar>
    ),
  },
];

// TODO: Don't show if user unauthenticated
export default function SideNavigation() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <>
      <div className={styles.container_placeholder} />

      <nav className={styles.container}>
        <Link href="/home">
          <p className={styles.logo_text}>lada land</p>
          <Image
            src="/logo.svg"
            alt="LADA LAND"
            width={50}
            height={50}
            className={styles.logo_image}
          />
        </Link>

        <ul className={styles.links}>
          {links.map(({ href, text, icon }) => (
            <Link key={href} href={href}>
              <li className={pathname === href ? styles.active : styles.link}>
                {icon}
                <p className={styles.link_text}>{text.toUpperCase()}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
}
