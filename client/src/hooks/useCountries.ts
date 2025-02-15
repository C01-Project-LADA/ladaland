import { useState, useEffect, useCallback } from 'react';
import ct from '@/lib/countries.json';

interface UseCountryParams {
  filter: string;
  page?: number;
}

// Custom hook for getting country data w/ filter
export default function useCountries({ filter, page = 1 }: UseCountryParams) {
  const [countries, setCountries] = useState<Country[]>(
    ct.slice((page - 1) * 10, page * 10)
  );
  const [pageCount, setPageCount] = useState(Math.ceil(ct.length / 10));
  const [loading, setLoading] = useState(false);

  const fetchCountries = useCallback(() => {
    if (filter.trim().length > 0) {
      setLoading(true);
      const filteredCountries = ct.filter((country) =>
        country.name.toLowerCase().includes(filter.toLowerCase())
      );
      setLoading(false);
      setPageCount(Math.ceil(filteredCountries.length / 10));
      setCountries(filteredCountries.slice((page - 1) * 10, page * 10));
    } else {
      setLoading(false);
      setPageCount(Math.ceil(ct.length / 10));
      setCountries(ct.slice((page - 1) * 10, page * 10));
    }
  }, [filter, page]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchCountries();
    }, 100);

    return () => clearTimeout(timeout);
  }, [fetchCountries]);

  return { countries, loading, pageCount };
}
