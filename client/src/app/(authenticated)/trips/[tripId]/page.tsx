'use client';

import { Suspense, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import NewTripForm from '@/components/NewTripForm';
import PageBanner from '@/components/PageBanner';
import { toast } from 'sonner';
import useTripForm from '@/hooks/useTripForm';
import useTrip from '@/hooks/useTrip';

function ExistingTripContent() {
  const searchParams = useSearchParams();
  const { tripId } = useParams();
  const { submitting, handleSubmit, error, clearError } = useTripForm();
  const {
    trip,
    // loading,
    // error: getTripError,
    // deleteTrip,
    // toggleCompleteTrip,
  } = useTrip((tripId as string) || '');

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
        message="Edit your trip"
        variant="blue"
        backLink="/trips"
      />
      <NewTripForm
        isNewTrip={false}
        existingTrip={trip || undefined}
        submitting={submitting}
        loadedLocation={country || ''}
        onSubmit={handleTripSubmit}
      />
    </div>
  );
}

export default function ExistingTripPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExistingTripContent />
    </Suspense>
  );
}
