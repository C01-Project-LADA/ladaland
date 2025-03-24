'use client';

import styles from '@/styles/SideNavigation.module.css';
import { House, Plane, MessageCircle, Trophy, BookText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import useUser from '@/hooks/useUser';
import axios from 'axios';

const links = [
  { href: '/home', text: 'Home', icon: <House /> },
  { href: '/trips', text: 'Trips', icon: <Plane /> },
  { href: '/social', text: 'Social', icon: <MessageCircle /> },
  { href: '/leaderboard', text: 'Leaderboard', icon: <Trophy /> },
  { href: '/passport-tool', text: 'Passport Tool', icon: <BookText /> },
];

const url = process.env.NEXT_PUBLIC_API_URL;

export default function SideNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useUser();

  function handleLogOut() {
    axios
      .post(`${url}/logout`, {}, { withCredentials: true })
      .then(() => {
        setTimeout(() => {
          window.location.href = '/';
        }, 250);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }

  return (
    <>
      <div className={styles.container_placeholder} />

      <nav className={styles.container}>
        <Link href="/home">
          <Image
            src="/LADAlogo.svg"
            alt="LADA LAND"
            width={150}
            height={50}
            priority
            className={styles.logo_text}
          />
          <Image
            src="/SmallLADAlogo.svg"
            alt="LADA LAND"
            width={50}
            height={50}
            className={styles.logo_image}
          />
        </Link>

        <ul className={styles.links}>
          {links.map(({ href, text, icon }) => (
            <TooltipProvider key={href}>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={href}>
                    <li
                      className={
                        pathname === href ? styles.active : styles.link
                      }
                    >
                      {icon}
                      <p className={styles.link_text}>{text.toUpperCase()}</p>
                    </li>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-bold py-1 px-2">{text.toUpperCase()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          <HoverCard openDelay={150} closeDelay={500}>
            <HoverCardTrigger>
              <li
                className={
                  pathname === '/profile' ? styles.active : styles.link
                }
              >
                <Avatar className="w-8 h-8 -ml-1 -mr-1">
                  <AvatarImage alt={`@${user?.username}`} />
                  <AvatarFallback
                    className="font-semibold text-gray-600"
                    title={user?.username}
                  >
                    {user?.username[0].toUpperCase() || ''}
                  </AvatarFallback>
                </Avatar>
                <p className={styles.link_text}>PROFILE</p>
              </li>
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              sideOffset={15}
              className="border border-2 border-[#e4e4e4]"
            >
              <button
                className={`${styles.link} w-full`}
                onClick={handleLogOut}
              >
                <li>LOG OUT</li>
              </button>
            </HoverCardContent>
          </HoverCard>
        </ul>
      </nav>
    </>
  );
}
