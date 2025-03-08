'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/PassportChecker.module.css';
import { Button } from '@/components/ui/button';
import useCountries from '@/hooks/useCountries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Pagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { Search, Check } from 'lucide-react';

export default function CountrySelectDialog({
  countriesSelected,
  setCountriesSelected,
  dialogTrigger,
  title,
  description,
}: {
  countriesSelected: Record<string, Country>;
  setCountriesSelected: React.Dispatch<
    React.SetStateAction<Record<string, Country>>
  >;
  dialogTrigger: React.ReactNode;
  title: string;
  description: string;
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Reset page when search changes
  useEffect(() => {
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { countries, pageCount } = useCountries({
    filter: search,
    page,
  });

  const modalInputRef = useRef<HTMLInputElement>(null);

  const [passportSearchOpen, setPassportSearchOpen] = useState(false);

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
    setCountriesSelected((prev) => ({
      ...prev,
      [country.code]: country,
    }));
    setSearch('');
    setPage(1);
  }

  return (
    <Dialog open={passportSearchOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className={styles.modal_container}>
        <DialogHeader>
          <DialogTitle className="text-xl mb-2">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription style={{ display: 'none' }}>
          {description}
        </DialogDescription>
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
                disabled={!!countriesSelected[country.code]}
                onClick={() => addPassport(country)}
              >
                <div className={styles.country_container}>
                  {countriesSelected[country.code] && (
                    <div className={styles.check}>
                      <Check strokeWidth="3px" size="28px" />
                    </div>
                  )}
                  <span
                    className={`fi !w-4/5 max-w-[80px] aspect-[4/3] fi-${country.code.toLowerCase()} bg-muted rounded-md`}
                  />
                  <p>{country.name}</p>
                </div>
              </Button>
            ))}
          </div>

          <Pagination page={page} pageCount={pageCount} setPage={setPage} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
