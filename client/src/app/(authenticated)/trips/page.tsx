'use client';

import PageBanner from '@/components/PageBanner';
import Trip from '@/components/Trip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import CountrySelectDialog from '@/components/CountrySelectDialog';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useTrips from '@/hooks/useTrips';

const mockTrip: Trip = {
  id: '1',
  userId: '1',
  name: 'Trip 1',
  startDate: new Date(1000000000000),
  endDate: new Date(1000000000000),
  budget: 1000,
  completed: false,
  expenses: [],
};

export default function Trips() {
  const router = useRouter();

  const { trips, loading, error } = useTrips();

  const [countriesSelected, setCountriesSelected] = useState<
    Record<string, Country>
  >({});

  // When countries selected changes, extract the country selected and revert it back to an empty object
  useEffect(() => {
    if (Object.keys(countriesSelected).length > 0) {
      const country = Object.values(countriesSelected)[0];
      setCountriesSelected({});
      router.push(`/trips/new?country=${country.code}`);
    }
  }, [countriesSelected, router]);

  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PageBanner
        title="TRIPS"
        message="Welcome back!"
        variant="green"
        direction="backwards"
        extraContent={
          <div className="mt-1">
            <p>Plan trips and level up!</p>
            <div className="mt-5 mb-1">
              <CountrySelectDialog
                title="Plan a new trip to..."
                description="Select a country to plan a new trip to."
                countriesSelected={{}}
                setCountriesSelected={setCountriesSelected}
                dialogTrigger={
                  <Button
                    variant="outline"
                    className="font-bold"
                    style={{ color: 'var(--lada-primary)' }}
                  >
                    <Plus /> NEW TRIP
                  </Button>
                }
              />
            </div>
          </div>
        }
      />

      <h3 className="mt-10 mb-2 text-gray-500 font-bold">Your Trips</h3>
      <Separator />

      <div className="mt-6 flex flex-col gap-2">
        {loading ? (
          <Skeleton className="h-24" />
        ) : trips.length === 0 ? (
          <p>No trips found. Start planning!</p>
        ) : (
          trips.map((trip) => <Trip key={trip.id} trip={trip} />)
        )}
      </div>

      <h3 className="mt-10 mb-2 text-gray-500 font-bold">Past Trips</h3>
      <Separator />
    </div>
  );
}
