'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

export default function ExpenseDialog({
  title,
  description,
  dialogTrigger,
  onSubmit,
}: {
  title: string;
  description: string;
  dialogTrigger: React.ReactNode;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
}) {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const [expenseType, setExpenseType] = useState<string>('');
  const [expenseName, setExpenseName] = useState<string>('');
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const disabled =
    !expenseType ||
    !expenseName ||
    !expenseAmount ||
    isNaN(+expenseAmount) ||
    +expenseAmount < 0;

  function handleOpenChange(open: boolean) {
    if (!open) {
      clearForm();
    }

    setExpenseDialogOpen(open);
  }

  function clearForm() {
    setExpenseType('');
    setExpenseName('');
    setExpenseAmount('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    onSubmit({
      type: expenseType,
      name: expenseName,
      cost: +expenseAmount,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={expenseDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="min-w-[50vw] max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="text-xl mb-2">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription style={{ display: 'none' }}>
          {description}
        </DialogDescription>

        <form className="mb-1" onSubmit={handleSubmit}>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex-1">
              <Select
                value={expenseType}
                onValueChange={setExpenseType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Expense type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flight</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="meals">Meals</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-[2] min-w-24">
              <Input
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="Expense name"
                required
              />
            </div>

            <div className="flex-1">
              <Input
                type="number"
                startIcon={DollarSign}
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Cost"
                required
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end items-center gap-5">
            <Button type="button" variant="secondary" onClick={clearForm}>
              CLEAR
            </Button>
            <Button disabled={disabled}>ADD</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
