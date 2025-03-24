import styles from '@/styles/PageBanner.module.css';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

interface PageBannerProps {
  title: string;
  variant?: 'green' | 'blue';
  direction?: 'forwards' | 'backwards';
  shadow?: boolean;
  message: string;
  backLink?: string;
  extraContent?: React.ReactNode;
}

function mapColorToGradient(
  variant: 'green' | 'blue',
  direction: 'forwards' | 'backwards'
) {
  if (variant === 'green') {
    if (direction === 'forwards') {
      return `var(--lada-primary) 0%,
      var(--lada-secondary) 100%`;
    } else {
      return `var(--lada-secondary) 0%,
      var(--lada-primary) 100%`;
    }
  } else if (variant === 'blue') {
    if (direction === 'forwards') {
      return `var(--lada-dark-accent) 0%,
      var(--lada-accent) 100%`;
    } else {
      return `var(--lada-accent) 0%,
      var(--lada-dark-accent) 100%`;
    }
  }
}

export default function PageBanner({
  title,
  variant = 'green',
  direction = 'forwards',
  shadow = false,
  message,
  backLink,
  extraContent,
}: PageBannerProps) {
  return (
    <div
      className={styles.header_block}
      style={{
        background: `linear-gradient(
    45deg,
    ${mapColorToGradient(variant, direction)}
  )`,
        boxShadow: shadow ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : 'none',
      }}
    >
      {backLink ? (
        <Link href={backLink}>
          <h2 className="flex items-center gap-2">
            <MoveLeft size={20} />
            {title}
          </h2>
        </Link>
      ) : (
        <h2>{title}</h2>
      )}
      <h1>{message}</h1>

      {extraContent}
    </div>
  );
}
