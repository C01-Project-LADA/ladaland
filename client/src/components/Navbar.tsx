import styles from '@/styles/Navbar.module.css';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className={styles.container}>
      <div className={styles.logo_container}>
        <Image src="/logo.svg" alt="LADA LAND" width={50} height={50} />
        <p className={styles.logo_text}>lada land</p>
      </div>
    </div>
  );
}
