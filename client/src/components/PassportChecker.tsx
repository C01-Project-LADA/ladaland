'use client';

import styles from '@/styles/PassportChecker.module.css';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, Check } from 'lucide-react';
import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  // AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Pagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import useCountries from '@/hooks/useCountries';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SectionHeading from '@/components/SectionHeading';

// const mockCountries = [
//   {
//     name: 'Benin',
//     code: 'BJ',
//   },
//   {
//     name: 'Bermuda',
//     code: 'BM',
//   },
//   {
//     name: 'Bhutan',
//     code: 'BT',
//   },
//   {
//     name: 'Bolivia',
//     code: 'BO',
//   },
//   {
//     name: 'Bonaire, Sint Eustatius and Saba',
//     code: 'BQ',
//   },
//   {
//     name: 'Bosnia and Herzegovina',
//     code: 'BA',
//   },
//   {
//     name: 'Botswana',
//     code: 'BW',
//   },
//   {
//     name: 'Bouvet Island',
//     code: 'BV',
//   },
//   {
//     name: 'Brazil',
//     code: 'BR',
//   },
//   {
//     name: 'British Indian Ocean Territory',
//     code: 'IO',
//   },
//   {
//     name: 'Brunei Darussalam',
//     code: 'BN',
//   },
//   {
//     name: 'Bulgaria',
//     code: 'BG',
//   },
//   {
//     name: 'Burkina Faso',
//     code: 'BF',
//   },
//   {
//     name: 'Burundi',
//     code: 'BI',
//   },
//   {
//     name: 'Cambodia',
//     code: 'KH',
//   },
//   {
//     name: 'Cameroon',
//     code: 'CM',
//   },
//   {
//     name: 'Canada',
//     code: 'CA',
//   },
//   {
//     name: 'Cape Verde',
//     code: 'CV',
//   },
//   {
//     name: 'Cayman Islands',
//     code: 'KY',
//   },
// ];
const mockCountries = [
  {
    code: 'CA',
    name: 'Canada',
  },
];

export default function PassportChecker() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [passportSearchOpen, setPassportSearchOpen] = useState(false);

  const [hasPassport, setHasPassport] = useState<Record<string, Country>>({});

  // Reset page when search changes
  useEffect(() => {
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { countries, pageCount } = useCountries({
    filter: search,
    page,
  });

  function handleOpenChange(open: boolean) {
    setPassportSearchOpen(open);
    if (!open) {
      setSearch('');
      setPage(1);
    }
  }

  function addPassport(country: Country) {
    setPassportSearchOpen(false);
    setHasPassport((prev) => ({
      ...prev,
      [country.code]: country,
    }));
    setSearch('');
    setPage(1);
  }

  function removePassport(country: Country) {
    setHasPassport((prev) => {
      const newPassports = { ...prev };
      delete newPassports[country.code];
      return newPassports;
    });
  }

  return (
    <div className="max-w-full">
      <AlertDialog open={passportSearchOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <div className="mb-5">
            <Button variant="secondary" className="font-medium">
              <Plus /> ADD PASSPORT
            </Button>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className={styles.modal_container}>
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <AlertDialogTitle style={{ fontSize: '1.3rem' }}>
                Add a passport
              </AlertDialogTitle>
              <AlertDialogCancel asChild>
                <Button
                  variant="ghost"
                  elevated={false}
                  size="icon"
                  style={{ borderWidth: 0 }}
                >
                  <X />
                </Button>
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription style={{ display: 'none' }}>
            Search for a passport to check its passport index.
          </AlertDialogDescription>
          <div className={styles.modal_content}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={Search}
              placeholder="Search for a country..."
            />

            <div className={styles.countries}>
              {countries.map((country) => (
                <Button
                  key={country.code}
                  variant="outline"
                  elevated={false}
                  className="w-full h-[120px] relative"
                  title={country.name}
                  disabled={!!hasPassport[country.code]}
                  onClick={() => addPassport(country)}
                >
                  <div className={styles.country_container}>
                    {hasPassport[country.code] && (
                      <div className={styles.check}>
                        <Check strokeWidth="3px" size="28px" />
                      </div>
                    )}
                    <div className="w-4/5">
                      <AspectRatio ratio={4 / 3} className="bg-muted">
                        <Image
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                          fill
                          alt={country.name}
                          className="h-full w-full rounded-md object-contain"
                        />
                      </AspectRatio>
                    </div>
                    <p>{country.name}</p>
                  </div>
                </Button>
              ))}
            </div>

            <Pagination page={page} pageCount={pageCount} setPage={setPage} />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        {Object.values(hasPassport).map((country) => (
          <div key={country.code} className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-2.5">
              <div className="w-[50px]">
                <AspectRatio ratio={4 / 3} className="bg-muted">
                  <Image
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    fill
                    alt={country.name}
                    className="h-full w-full rounded-md object-contain"
                  />
                </AspectRatio>
              </div>
              <p className="text-gray-600 font-medium">{country.name}</p>
            </div>

            <Button
              variant="ghost"
              elevated={false}
              size="icon"
              onClick={() => removePassport(country)}
            >
              <X />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <SectionHeading title="Visa-free access" />
        <div className={styles.country_results}>
          {mockCountries.map((country) => (
            <div key={country.code} className="flex items-center gap-1.5">
              <div className="w-[35px]">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    loading="lazy"
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    fill
                    alt={country.name}
                    className="h-full w-full rounded-md object-contain"
                  />
                </AspectRatio>
              </div>
              <p className="text-gray-600 text-sm">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <SectionHeading title="Visa on arrival" />
        <div className={styles.country_results}>
          {mockCountries.map((country) => (
            <div key={country.code} className="flex items-center gap-1.5">
              <div className="w-[35px]">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    loading="lazy"
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    fill
                    alt={country.name}
                    className="h-full w-full rounded-md object-contain"
                  />
                </AspectRatio>
              </div>
              <p className="text-gray-600 text-sm">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <SectionHeading title="eTA" />
        <div className={styles.country_results}>
          {mockCountries.map((country) => (
            <div key={country.code} className="flex items-center gap-1.5">
              <div className="w-[35px]">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    loading="lazy"
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    fill
                    alt={country.name}
                    className="h-full w-full rounded-md object-contain"
                  />
                </AspectRatio>
              </div>
              <p className="text-gray-600 text-sm">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <SectionHeading title="e-Visa" />
        <div className={styles.country_results}>
          {mockCountries.map((country) => (
            <div key={country.code} className="flex items-center gap-1.5">
              <div className="w-[35px]">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    loading="lazy"
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    fill
                    alt={country.name}
                    className="h-full w-full rounded-md object-contain"
                  />
                </AspectRatio>
              </div>
              <p className="text-gray-600 text-sm">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 mb-10">
        <SectionHeading title="Visa required" />
        <div className={styles.country_results}>
          {mockCountries.map((country) => (
            <div key={country.code} className="flex items-center gap-1.5">
              <div className="w-[35px]">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    loading="lazy"
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    fill
                    alt={country.name}
                    className="h-full w-full rounded-md object-contain"
                  />
                </AspectRatio>
              </div>
              <p className="text-gray-600 text-sm">{country.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
