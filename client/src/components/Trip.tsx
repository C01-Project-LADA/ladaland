import React from 'react';
import Link from 'next/link';
import { MapPin, EllipsisVertical, Pencil, Trash, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { findDifferenceInDays } from '@/lib/utils';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

ct.registerLocale(en);

export default function Trip({ trip }: { trip: Trip }) {
  return (
    <div className="border border-gray-400 px-4 py-3 rounded-md flex gap-2">
      <div className="flex-[2]">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/trips/${trip.id}`}>
              <p
                className="font-bold text-xl"
                style={{
                  color: 'var(--lada-primary)',
                  filter: 'brightness(0.8)',
                }}
              >
                {trip.name}
              </p>
            </Link>
            <div className="flex gap-2 items-center mt-1">
              <MapPin size={18} />
              <p className="text-sm">{ct.getName(trip.location, 'en')}</p>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" elevated={false}>
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64"
              side="right"
              align="start"
              sideOffset={-40}
            >
              <ul>
                <li>
                  <Link href={`/trips/${trip.id}`}>
                    <div className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-gray-500 leading-none text-left">
                      <Pencil />
                      Edit trip
                    </div>
                  </Link>
                </li>
                <li>
                  <button className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-gray-500 leading-none text-left">
                    <Check />
                    Mark as completed
                  </button>
                </li>
                <li>
                  <button className="hover:bg-[#e9e9e9] duration-150 w-full flex items-center py-3 px-4 gap-3 font-bold text-red-500 leading-none text-left">
                    <Trash />
                    Delete trip
                  </button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          {trip.startDate.toDateString()} — {trip.endDate.toDateString()} (
          {findDifferenceInDays(trip.startDate, trip.endDate)} days)
        </p>

        <div className="mt-3 mb-1">
          <Button
            size="sm"
            variant="outline"
            style={{ color: 'var(--lada-primary)' }}
          >
            EDIT TRIP
          </Button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <span
          className={`fi !w-[75%] aspect-[4/3] fi-${trip.location.toLowerCase()} bg-muted rounded-md`}
        />
      </div>
    </div>
  );
}
