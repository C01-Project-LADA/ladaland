'use client';

import styles from '@/styles/SlidingCountries.module.css';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

ct.registerLocale(en);

const scrollingCountries = [
  'mx',
  'gt',
  'hn',
  'ni',
  'cr',
  'pa',
  'cu',
  'ca',
  'us',
  'jm',
  'ht',
  'do',
  'bs',
  'bb',
  'gd',
  'tt',
  'lc',
  'kn',
  'ag',
  'vc',
  'dm',
  've',
  'kr',
];

export default function SlidingCountries() {
  return (
    <div className="border-t border-b border-gray-400 py-4 mt-16 flex overflow-hidden">
      <div className={`flex gap-8 ${styles.scroll1}`}>
        {scrollingCountries.map((country) => (
          <div className="flex items-center gap-1.5 w-fit" key={country}>
            <span
              className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${country} bg-muted rounded-md`}
            />
            <p className="text-gray-800 text-sm leading-none text-xs w-max">
              {ct.getName(country, 'en')}
            </p>
          </div>
        ))}
        <div />
      </div>
      <div className={`flex gap-8 ${styles.scroll2}`}>
        {scrollingCountries.map((country) => (
          <div className="flex items-center gap-1.5 w-fit" key={country}>
            <span
              className={`fi !w-[35px] max-w-[80px] aspect-[4/3] fi-${country} bg-muted rounded-md`}
            />
            <p className="text-gray-800 text-sm leading-none text-xs w-max">
              {ct.getName(country, 'en')}
            </p>
          </div>
        ))}
        <div />
      </div>
    </div>
  );
}
