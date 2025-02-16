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
import { useEffect, useMemo, useRef, useState } from 'react';
import useCountries from '@/hooks/useCountries';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import SectionHeading from '@/components/SectionHeading';
import useVisaRequirements from '@/hooks/useVisaRequirements';
import { Badge } from '@/components/ui/badge';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

ct.registerLocale(en);

export default function PassportChecker() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [passportSearchOpen, setPassportSearchOpen] = useState(false);

  const [hasPassport, setHasPassport] = useState<
    Record<string, Country & { index: number }>
  >({});

  // Reset page when search changes
  useEffect(() => {
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { countries, pageCount } = useCountries({
    filter: search,
    page,
  });
  const passports = useMemo(() => Object.keys(hasPassport), [hasPassport]);
  const haveMultiplePassports = passports.length > 1;

  const { visaRequirements, loading: visaReqsLoading } = useVisaRequirements({
    passports,
  });
  const visaFreeCountries = useMemo(
    () =>
      visaRequirements?.filter(
        (req) =>
          req.requirement !== 'visa on arrival' &&
          req.requirement !== 'eta' &&
          req.requirement !== 'e-visa' &&
          req.requirement !== 'visa required' &&
          req.requirement !== 'no admission'
      ) || [],
    [visaRequirements]
  );
  const visaOnArrivalCountries = useMemo(
    () =>
      visaRequirements?.filter(
        (req) => req.requirement === 'visa on arrival'
      ) || [],
    [visaRequirements]
  );
  const etaCountries = useMemo(
    () => visaRequirements?.filter((req) => req.requirement === 'eta') || [],
    [visaRequirements]
  );
  const eVisaCountries = useMemo(
    () => visaRequirements?.filter((req) => req.requirement === 'e-visa') || [],
    [visaRequirements]
  );
  const visaRequiredCountries = useMemo(
    () =>
      visaRequirements?.filter((req) => req.requirement === 'visa required') ||
      [],
    [visaRequirements]
  );
  // const noAdmissionCountries = useMemo(
  //   () =>
  //     visaRequirements?.filter((req) => req.requirement === 'no admission') ||
  //     [],
  //   [visaRequirements]
  // );

  const modalInputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(open: boolean) {
    setPassportSearchOpen(open);
    if (!open) {
      setSearch('');
      setPage(1);
    } else {
      setTimeout(() => {
        modalInputRef.current?.focus();
      }, 200);
    }
  }

  function addPassport(country: Country) {
    setPassportSearchOpen(false);
    setHasPassport((prev) => ({
      ...prev,
      [country.code]: { ...country, index: Object.keys(prev).length + 1 },
    }));
    setSearch('');
    setPage(1);
  }

  function removePassport(country: Country) {
    setHasPassport((prev) => {
      const newPassports = { ...prev };
      delete newPassports[country.code];

      const updatedPassports = Object.keys(newPassports).reduce(
        (acc, code, index) => {
          acc[code] = { ...newPassports[code], index: index + 1 };
          return acc;
        },
        {} as Record<string, Country & { index: number }>
      );

      return updatedPassports;
    });
  }

  const countrySkeletons = Array.from({ length: 6 }, (_, i) => i).map(
    (_, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <Skeleton className="w-[35px] h-[26.25px] rounded-md" />

        <Skeleton className="w-[80px] h-4 rounded-md" />
      </div>
    )
  );

  return (
    <div className="max-w-full">
      <AlertDialog open={passportSearchOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <div className="mb-5 w-fit">
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
              ref={modalInputRef}
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

      {Object.values(hasPassport).length !== 0 && (
        <>
          <div className="border-gray-300 border pt-2 pl-4 pr-4 rounded-md">
            {Object.values(hasPassport).map((country) => (
              <div
                key={country.code}
                className="flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-4">
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
                  {haveMultiplePassports && (
                    <p className="text-gray-600 text-xs -ml-3 mb-[-10px]">
                      {country.index}
                    </p>
                  )}
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
            <SectionHeading
              title="Visa-free access"
              subtitle={`${visaFreeCountries.length} countr${
                visaFreeCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : visaFreeCountries
                    .sort(({ requirement: reqA }, { requirement: reqB }) => {
                      const numA = parseInt(reqA);
                      const numB = parseInt(reqB);
                      const isNumA = !isNaN(numA);
                      const isNumB = !isNaN(numB);

                      if (!isNumA && !isNumB) return reqA.localeCompare(reqB);
                      if (!isNumA) return -1;
                      if (!isNumB) return 1;

                      return numB - numA;
                    })
                    .map((req) => (
                      <div
                        key={req.destination}
                        className="flex items-center gap-1.5"
                      >
                        <div className="w-[35px]">
                          <AspectRatio ratio={4 / 3}>
                            <Image
                              loading="lazy"
                              src={`https://flagcdn.com/${req.destination.toLowerCase()}.svg`}
                              fill
                              alt={ct.getName(req.destination, 'en') || ''}
                              className="h-full w-full rounded-md object-contain"
                            />
                          </AspectRatio>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {ct.getName(req.destination, 'en')}
                        </p>
                        {haveMultiplePassports && (
                          <p className="text-gray-600 text-xs -ml-1 mb-[-10px] mr-1">
                            {hasPassport[req.passport]?.index}
                          </p>
                        )}
                        <Badge>{req.requirement}</Badge>
                      </div>
                    ))}
            </div>
          </div>
          <div className="mt-10">
            <SectionHeading
              title="Visa on arrival"
              subtitle={`${visaOnArrivalCountries.length} countr${
                visaOnArrivalCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : visaOnArrivalCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <div className="w-[35px]">
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            loading="lazy"
                            src={`https://flagcdn.com/${req.destination.toLowerCase()}.svg`}
                            fill
                            alt={ct.getName(req.destination, 'en') || ''}
                            className="h-full w-full rounded-md object-contain"
                          />
                        </AspectRatio>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p className="text-gray-600 text-xs -ml-1 mb-[-10px]">
                          {hasPassport[req.passport]?.index}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="mt-10">
            <SectionHeading
              title="eTA"
              subtitle={`${etaCountries.length} countr${
                etaCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : etaCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <div className="w-[35px]">
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            loading="lazy"
                            src={`https://flagcdn.com/${req.destination.toLowerCase()}.svg`}
                            fill
                            alt={ct.getName(req.destination, 'en') || ''}
                            className="h-full w-full rounded-md object-contain"
                          />
                        </AspectRatio>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p className="text-gray-600 text-xs -ml-1 mb-[-10px]">
                          {hasPassport[req.passport]?.index}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="mt-10">
            <SectionHeading
              title="e-Visa"
              subtitle={`${eVisaCountries.length} countr${
                eVisaCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : eVisaCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <div className="w-[35px]">
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            loading="lazy"
                            src={`https://flagcdn.com/${req.destination.toLowerCase()}.svg`}
                            fill
                            alt={ct.getName(req.destination, 'en') || ''}
                            className="h-full w-full rounded-md object-contain"
                          />
                        </AspectRatio>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p className="text-gray-600 text-xs -ml-1 mb-[-10px]">
                          {hasPassport[req.passport]?.index}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="mt-10 mb-10">
            <SectionHeading
              title="Visa required"
              subtitle={`${visaRequiredCountries.length} countr${
                visaRequiredCountries.length === 1 ? 'y' : 'ies'
              }`}
            />
            <div className={styles.country_results}>
              {visaReqsLoading
                ? countrySkeletons
                : visaRequiredCountries.map((req) => (
                    <div
                      key={req.destination}
                      className="flex items-center gap-1.5"
                    >
                      <div className="w-[35px]">
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            loading="lazy"
                            src={`https://flagcdn.com/${req.destination.toLowerCase()}.svg`}
                            fill
                            alt={ct.getName(req.destination, 'en') || ''}
                            className="h-full w-full rounded-md object-contain"
                          />
                        </AspectRatio>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {ct.getName(req.destination, 'en')}
                      </p>
                      {haveMultiplePassports && (
                        <p className="text-gray-600 text-xs -ml-1 mb-[-10px]">
                          {hasPassport[req.passport]?.index}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
