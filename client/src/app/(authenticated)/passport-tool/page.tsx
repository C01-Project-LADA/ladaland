import PassportChecker from '@/components/PassportChecker';
import styles from '@/styles/PassportTool.module.css';

export default function PassportTool() {
  return (
    <div className={styles.container}>
      <div className={styles.header_block}>
        <h2>PASSPORT TOOL</h2>
        <h1>Check if you need a visa for your next destination!</h1>
      </div>

      <h2 className={styles.title}>I have a passport from...</h2>

      <PassportChecker />
    </div>
  );
}
