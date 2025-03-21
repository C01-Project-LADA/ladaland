/* eslint-disable @typescript-eslint/no-unused-vars */

type Trip = {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  completed: boolean;
  expenses: Expense[];
};

type Expense = {
  id: string;
  type: string;
  name: string;
  cost: number;
};
