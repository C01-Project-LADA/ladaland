'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page,
  pageCount,
  setPage,
}: {
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className="w-full justify-center flex items-center gap-6">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft strokeWidth={3} color="darkgreen" />
      </Button>
      <p className="text-lg font-semibold">{page}</p>
      <Button
        variant="outline"
        size="icon"
        disabled={page === pageCount}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight strokeWidth={3} color="darkgreen" />
      </Button>
    </div>
  );
}
