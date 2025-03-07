import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Return a string formatted to a user-readable string
 * @param number Number of comments, likes, or dislikes to format to a user-readable string
 */
export function formatNumberToKorM(number: number): string {
  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(1)}B`;
  } else if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`;
  } else if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  } else {
    return number.toString();
  }
}

/**
 * Return the post date formatted to a user-readable string
 * @param createdAt Date of post creation
 * @param updatedAt Date of post update
 */
export function formatLastUpdatedDate(
  createdAt: Date,
  updatedAt: Date
): string {
  return createdAt.toDateString() === updatedAt.toDateString()
    ? formatPastDate(createdAt)
    : `Updated ${formatPastDate(updatedAt)}`;
}

export function formatPastDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60_000) {
    return 'Just now';
  } else if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m ago`;
  } else if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)}h ago`;
  } else if (diff < 604_800_000) {
    return `${Math.floor(diff / 86_400_000)}d ago`;
  } else if (diff < 2_419_200_000) {
    return `${Math.floor(diff / 604_800_000)}w ago`;
  } else {
    return date.toDateString();
  }
}
