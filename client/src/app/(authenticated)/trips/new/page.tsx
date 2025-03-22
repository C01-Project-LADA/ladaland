'use client';

import PageBanner from '@/components/PageBanner';
import TripForm from '@/components/TripForm';
import { useSearchParams } from 'next/navigation';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

ct.registerLocale(en);

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

export default function NewTripPage() {
  const searchParams = useSearchParams();

  const country = searchParams.get('country');

  return (
    <div
      className="pl-[20px] pt-[30px]"
      style={{ width: 'clamp(200px, 50vw, 500px)' }}
    >
      <PageBanner
        title="ALL TRIPS"
        message={`Plan a new trip ${
          country ? `to ${ct.getName(country, 'en')}` : ''
        }`}
        variant="blue"
        backLink="/trips"
      />

      <TripForm trip={mockTrip} />
    </div>
  );
}
