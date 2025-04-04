import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_API_URL;

export interface TravelSuggestion {
  destination: string;
  reason: string;
  cost: number;
  purchaseOption: string;
}

export default function useTravelSuggestions(budget: number, country: string) {
  const [suggestions, setSuggestions] = useState<TravelSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${url}/travel-suggestions`,
        { budget, country },
        { withCredentials: true }
      );

      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions);
      } else if (response.data.message) {
        setSuggestions([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch travel suggestions');
    } finally {
      setLoading(false);
    }
  }, [budget, country]);

  useEffect(() => {
    if (budget && country) {
      fetchSuggestions();
    }
  }, [budget, country, fetchSuggestions]);

  return {
    suggestions,
    loading,
    error,
    refresh: fetchSuggestions,
  };
}