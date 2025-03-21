import React from 'react';

export default function Trip({ trip }: { trip: Trip }) {
  return (
    <div>
      <div>{trip.name}</div>
    </div>
  );
}
