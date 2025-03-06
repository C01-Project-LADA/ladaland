'use client';
import React from 'react';
import styles from '@/styles/VisitedCountriesBanner.module.css';

interface VisitedCountriesBannerProps {
  visitedMessage: string;
}

export default function VisitedCountriesBanner({
  visitedMessage,
}: VisitedCountriesBannerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header_block}>
        <h2>Travel Progress</h2>
        <h1>{visitedMessage}</h1>
      </div>
    </div>
  );
}
