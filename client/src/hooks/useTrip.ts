import axios from 'axios';
import { useState, useEffect } from 'react';

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useTrip(id: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function deleteTrip() {
    axios.delete(`${url}/trips/${id}`, { withCredentials: true }).then(() => {
      setTrip(null);
    });
  }

  function toggleCompleteTrip() {
    if (!trip) return;

    axios
      .put(
        `${url}/trips/${id}`,
        { ...trip, completed: !trip.completed },
        { withCredentials: true }
      )
      .then(() => {
        setTrip({ ...trip, completed: !trip.completed });
      });
  }

  useEffect(() => {
    async function fetchTrip() {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(`${url}/trips/${id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch trip');
        }
        const data = await response.json();
        const trip = {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        };
        setTrip(trip);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trip');
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [id]);

  return { trip, loading, error, deleteTrip, toggleCompleteTrip };
}
