'use client';

import PageBanner from '@/components/PageBanner';
import Trip from '@/components/Trip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';

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
              <Button
                variant="outline"
                className="font-bold"
                style={{ color: 'var(--lada-primary)' }}
              >
                <Plus /> NEW TRIP
              </Button>
            </div>
          </div>
        }
      />

      <h3 className="mt-10 mb-2 text-gray-500 font-bold">Your Trips</h3>
      <Separator />

      <div className="mt-6 flex flex-col gap-2">
        <Trip trip={mockTrip} />
      </div>

      <h3 className="mt-10 mb-2 text-gray-500 font-bold">Past Trips</h3>
      <Separator />
    </div>
  );
}
