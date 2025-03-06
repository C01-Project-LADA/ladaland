import styles from '@/styles/PageBanner.module.css';

interface PageBannerProps {
  title: string;
  variant?: 'green' | 'blue';
  direction?: 'forwards' | 'backwards';
  message: string;
}

function mapColorToGradient(
  variant: 'green' | 'blue',
  direction: 'forwards' | 'backwards'
) {
  if (variant === 'green') {
    return `var(--lada-primary) ${direction === 'forwards' ? '0%' : '100%'},
    var(--lada-secondary) ${direction === 'forwards' ? '100%' : '0%'}`;
  } else if (variant === 'blue') {
    return `var(--lada-dark-accent) ${direction === 'forwards' ? '0%' : '100%'},
    var(--lada-accent) ${direction === 'forwards' ? '100%' : '0%'}`;
  }
}

export default function PageBanner({
  title,
  variant = 'green',
  direction = 'forwards',
  message,
}: PageBannerProps) {
  return (
    <div
      className={styles.header_block}
      style={{
        background: `linear-gradient(
    45deg,
    ${mapColorToGradient(variant, direction)}
  )`,
      }}
    >
      <h2>{title}</h2>
      <h1>{message}</h1>
    </div>
  );
}
