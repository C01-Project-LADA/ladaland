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

export default function ExpenseDialog({
  title,
  description,
  dialogTrigger,
}: {
  title: string;
  description: string;
  dialogTrigger: React.ReactNode;
}) {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  const [expenseType, setExpenseType] = useState<string>('');
  const [expenseName, setExpenseName] = useState<string>('');
  const [expenseAmount, setExpenseAmount] = useState<number | null>(null);

  const notReady = !expenseType || !expenseName || !expenseAmount;

  function handleOpenChange(open: boolean) {
    setExpenseDialogOpen(open);
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

        <div className="mb-4">
          <div className="flex gap-3 items-center">
            <Select value={expenseType} onValueChange={setExpenseType}>
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

            <Input />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
