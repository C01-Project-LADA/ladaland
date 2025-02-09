import styles from '@/styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Auth from '@/components/Auth';

export default function Navbar() {
  return (
    <div className={styles.container}>
      <div className={styles.logo_container}>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="LADA LAND"
            width={50}
            height={50}
            priority
          />
        </Link>
        <p className={styles.logo_text}>lada land</p>
      </div>

      <Auth />
    </div>
  );
}
