/* eslint-disable @typescript-eslint/no-unused-vars */

export type User = {
  id: string;
  username: string;
  email: string;
  points: number;
  level?: number;
  phone: string;
  createdAt: string;
};

export type UserWithRanking = {
  visitedCount: number;
  id: string;
  username: string;
  visitedCountries: string | null;
  points: number;
};
