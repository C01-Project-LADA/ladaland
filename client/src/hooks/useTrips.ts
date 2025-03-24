import { useState, useEffect } from 'react';

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(`${url}/trips`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        const trips = data.map((trip: Trip) => ({
          ...trip,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate),
        }));
        setTrips(trips);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  return { trips, loading, error };
}
