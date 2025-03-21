import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Trip({ trip }: { trip: Trip }) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="border px-4 py-3 rounded-md">
        <div>
          <p
            className="font-bold text-lg"
            style={{ color: 'var(--lada-primary)', filter: 'brightness(0.8)' }}
          >
            {trip.name}
          </p>
          <div className="flex gap-2 items-center mt-1">
            <MapPin size={18} />
            <p className="text-sm">Trip Location</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
