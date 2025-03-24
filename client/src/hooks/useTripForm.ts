import { useState } from 'react';
import axios from 'axios';

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useTripForm(isNew = false) {
  /**
   * Whether the trip is currently being processed & submitted
   */
  const [submitting, setSubmitting] = useState(false);
  /**
   * Possible error message when submitting post
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Delete an expense for an existing trip (while editing)
   */
  async function deleteExpense(expenseId: string) {
    try {
      await axios.delete(`${url}/expenses/${expenseId}`, {
        withCredentials: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    }
  }

  /**
   * Handle trip submit
   */
  async function handleSubmit(
    trip: Omit<Trip, 'id' | 'expenses'> & {
      id?: string;
      expenses: (Omit<Expense, 'id'> & { id?: string })[];
    }
  ) {
    setSubmitting(true);
    setError(null);

    try {
      if (isNew || !trip?.id) {
        console.log(trip);
        await axios.post(`${url}/trips`, trip, { withCredentials: true });
      } else {
        await axios.put(`${url}/trips/${trip.id}`, trip, {
          withCredentials: true,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit trip');
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Clear error message
   */
  function clearError() {
    setError(null);
  }

  return {
    submitting,
    handleSubmit,
    deleteExpense,
    error,
    clearError,
  };
}
