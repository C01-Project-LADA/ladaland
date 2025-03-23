/* eslint-disable @typescript-eslint/no-unused-vars */

type Trip = {
  id: string;
  userId: string;
  /**
   * 2 letter ISO country code
   */
  location: string;
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
