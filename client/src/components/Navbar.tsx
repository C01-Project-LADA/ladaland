import styles from '@/styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Auth from '@/components/Auth';

export default function Navbar() {
  return (
    <header className={styles.container}>
      <Link href="/">
        <div className={styles.logo_container}>
          <Image
            src="/LADAlogo.svg"
            alt="LADA LAND"
            width={150}
            height={50}
            priority
          />
        </div>
      </Link>

      <Auth />
    </header>
  );
}
