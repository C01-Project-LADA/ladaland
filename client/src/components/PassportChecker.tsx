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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
// import SectionHeading from '@/components/SectionHeading';

export default function PassportChecker() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [passportSearchOpen, setPassportSearchOpen] = useState(false);

  const [hasPassport, setHasPassport] = useState<Record<string, Country>>({});

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
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
    <>
      <AlertDialog open={passportSearchOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button variant="secondary" style={{ fontWeight: 500 }}>
            <Plus /> ADD PASSPORT
          </Button>
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

      <div className="mt-5">
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
        <Accordion
          type="multiple"
          defaultValue={['visa-free']}
          orientation="horizontal"
        >
          <AccordionItem value="visa-free">
            <AccordionTrigger>
              <div>
                <h2 className="font-semibold text-lg">Visa-free access</h2>
                <h3 className="text-left text-sm text-gray-500 mt-1">
                  194 countries
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <p>hello</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
