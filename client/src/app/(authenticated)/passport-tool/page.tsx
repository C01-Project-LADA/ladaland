import PageBanner from '@/components/PageBanner';
import PassportChecker from '@/components/PassportChecker';
import styles from '@/styles/PassportTool.module.css';

export default function PassportTool() {
  return (
    <div className={styles.container}>
      <PageBanner
        title="PASSPORT TOOL"
        message="Check if you need a visa for your next destination!"
      />

      <h2 className={styles.title}>I have a passport from...</h2>

      <PassportChecker />
    </div>
  );
}
