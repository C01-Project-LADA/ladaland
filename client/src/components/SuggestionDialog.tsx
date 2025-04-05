'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useTravelSuggestions from '@/hooks/useTravelSuggestions';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

export default function AISuggestionDialog({
  title,
  description,
  dialogTrigger,
  country,
  budget,
  onSubmit,
}: {
  title: string;
  description: string;
  dialogTrigger: React.ReactNode;
  country: string;
  budget: number;
  onSubmit: (expenses: Omit<Expense, 'id'>[]) => void;
}) {
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);

  const {
    suggestions,
    loading,
    error,
    refresh: fetchSuggestions,
  } = useTravelSuggestions(budget, country);

  const suggestionExpenses: Omit<Expense, 'id'>[] = suggestions.map(
    (suggestion) => ({
      type: 'events',
      name: suggestion.destination,
      cost: suggestion.cost,
    })
  );

  const [suggestionIndicesChecked, setSuggestionIndicesChecked] = useState<
    Record<number, boolean>
  >({});

  // Show toast error if any for the suggestions
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const disabled =
    loading ||
    !Object.values(suggestionIndicesChecked).some((checked) => checked);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSuggestionIndicesChecked({});
    } else {
      fetchSuggestions();
    }

    setSuggestionDialogOpen(open);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(
      suggestionExpenses.filter((_, index) => suggestionIndicesChecked[index])
    );
    handleOpenChange(false);
  }

  return (
    <Dialog open={suggestionDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="min-w-[50vw] max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-xl mb-2 text-left">{title}</DialogTitle>
          <p className="text-gray-500 text-sm">
            *Suggestions provided courtesy of OpenAI
          </p>
        </DialogHeader>
        <DialogDescription style={{ display: 'none' }}>
          {description}
        </DialogDescription>

        {loading ? (
          <>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
          </>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index} className="border p-3 rounded-md border-primary">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`suggestion-${index}`}
                    checked={suggestionIndicesChecked[index]}
                    onCheckedChange={(checked) =>
                      setSuggestionIndicesChecked((prev) => ({
                        ...prev,
                        [index]: checked as boolean,
                      }))
                    }
                  />
                  <label htmlFor={`suggestion-${index}`}>
                    {suggestion.destination} -{' '}
                    <span className="font-bold">${suggestion.cost}</span>
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-700 pl-5">
                &quot;{suggestion.reason}&quot;{' '}
                {suggestion.purchaseOption.includes('http') ? (
                  <a
                    href={suggestion.purchaseOption}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    ({suggestion.purchaseOption})
                  </a>
                ) : (
                  <span>({suggestion.purchaseOption})</span>
                )}
              </p>
            </div>
          ))
        )}

        <div className="mt-5 flex justify-end items-center gap-5">
          <p className="text-xs text-gray-700">
            (Suggestions generated with budget of ${budget})
          </p>
          <Button disabled={disabled} variant="accent" onClick={handleSubmit}>
            ADD SUGGESTIONS
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
