'use client';

import NewTripForm from '@/components/NewTripForm';
import PageBanner from '@/components/PageBanner';
import { toast } from 'sonner';
import useTripForm from '@/hooks/useTripForm';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
// import ct from 'i18n-iso-countries';
// import en from 'i18n-iso-countries/langs/en.json';

// ct.registerLocale(en);

export default function NewTripPage() {
  const searchParams = useSearchParams();
  const { submitting, handleSubmit, error, clearError } = useTripForm(true);

  // Toast error message
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const country = searchParams.get('country');

  async function handleTripSubmit(
    tripData: Omit<Trip, 'expenses' | 'id'> & {
      expenses: (Omit<Expense, 'id'> & { id?: string })[];
    }
  ) {
    clearError();
    await handleSubmit(tripData);
  }

  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PageBanner
        title="ALL TRIPS"
        message="Plan a new trip"
        variant="blue"
        backLink="/trips"
      />

      <NewTripForm
        submitting={submitting}
        loadedLocation={country || ''}
        onSubmit={handleTripSubmit}
      />
    </div>
  );
}
