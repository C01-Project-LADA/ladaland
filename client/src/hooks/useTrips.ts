import axios from 'axios';
import { useState, useEffect } from 'react';

const url = process.env.NEXT_PUBLIC_API_URL;

export default function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function deleteTrip(id: string) {
    axios.delete(`${url}/trips/${id}`, { withCredentials: true }).then(() => {
      setTrips((trips) => trips.filter((trip) => trip.id !== id));
    });
  }

  function toggleCompleteTrip(id: string) {
    const trip = trips.find((trip) => trip.id === id);
    if (!trip) return;

    axios
      .put(
        `${url}/trips/${id}`,
        { ...trip, completed: !trip.completed },
        { withCredentials: true }
      )
      .then(() => {
        setTrips((trips) =>
          trips.map((trip) =>
            trip.id === id ? { ...trip, completed: !trip.completed } : trip
          )
        );
      });
  }

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

  return { trips, loading, error, deleteTrip, toggleCompleteTrip };
}
