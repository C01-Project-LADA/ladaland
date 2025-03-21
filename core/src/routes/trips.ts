import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Trip name is required'),
    body('startDate').notEmpty().withMessage('Start date is required'),
    body('endDate').notEmpty().withMessage('End date is required'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean'),
    body('expenses')
      .optional()
      .isArray()
      .withMessage('Expenses must be an array'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    // Ensure user is logged in
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized. Please log in.' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { name, startDate, endDate, budget, completed, expenses } = req.body;
    const userId = req.session.user.id;
    try {
      const trip = await prisma.trip.create({
        data: {
          userId,
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          budget,
          completed: completed !== undefined ? completed : false,
          expenses: expenses
            ? {
                create: expenses.map((exp: any) => ({
                  type: exp.type,
                  name: exp.name,
                  cost: exp.cost,
                })),
              }
            : undefined,
        },
        include: { expenses: true },
      });
      res.status(201).json(trip);
    } catch (error) {
      console.error('Error creating trip:', error);
      res.status(500).json({ error: 'Error creating trip' });
    }
  }
);

router.put(
  '/:tripId',
  [
    // Validations as before…
    body('name').optional().notEmpty().withMessage('Trip name cannot be empty'),
    body('startDate')
      .optional()
      .notEmpty()
      .withMessage('Start date cannot be empty'),
    body('endDate')
      .optional()
      .notEmpty()
      .withMessage('End date cannot be empty'),
    body('budget')
      .optional()
      .isNumeric()
      .withMessage('Budget must be a number'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean'),
    body('expenses')
      .optional()
      .isArray()
      .withMessage('Expenses must be an array'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized. Please log in.' });
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { tripId } = req.params;
    const { name, startDate, endDate, budget, completed, expenses } = req.body;
    const userId = req.session.user.id;
    try {
      // Ensure the trip belongs to the current user before updating
      const existingTrip = await prisma.trip.findFirst({
        where: { id: tripId, userId },
      });
      if (!existingTrip) {
        res.status(404).json({ error: 'Trip not found or unauthorized' });
        return;
      }

      // Update trip main fields
      await prisma.trip.update({
        where: { id: tripId },
        data: {
          name,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          budget,
          completed,
        },
      });

      // Handle expense updates
      if (expenses && Array.isArray(expenses)) {
        for (const exp of expenses) {
          if (exp.id) {
            // Update an existing expense
            await prisma.expense.update({
              where: { id: exp.id },
              data: {
                type: exp.type,
                name: exp.name,
                cost: exp.cost,
              },
            });
          } else {
            // Create a new expense for the trip
            await prisma.expense.create({
              data: {
                type: exp.type,
                name: exp.name,
                cost: exp.cost,
                trip: { connect: { id: tripId } },
              },
            });
          }
        }
      }

      // Retrieve updated trip
      const updatedTrip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: { expenses: true },
      });

      res.status(200).json(updatedTrip);
    } catch (error) {
      console.error('Error updating trip:', error);
      res.status(500).json({ error: 'Error updating trip' });
    }
  }
);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
    return;
  }
  const userId = req.session.user.id;
  try {
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: { expenses: true },
    });
    const tripsWithBudgetLeft = trips.map((trip) => {
      const totalExpenses = trip.expenses.reduce(
        (sum, expense) => sum + expense.cost,
        0
      );
      return {
        ...trip,
        budgetLeft: trip.budget - totalExpenses,
      };
    });
    res.status(200).json(tripsWithBudgetLeft);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Error fetching trips' });
  }
});

router.get('/:tripId', async (req: Request, res: Response): Promise<void> => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
    return;
  }
  const userId = req.session.user.id;
  const { tripId } = req.params;
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId, // Ensure the trip belongs to the current user
      },
      include: { expenses: true },
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    const totalExpenses = trip.expenses.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );
    const budgetLeft = trip.budget - totalExpenses;

    res.status(200).json({
      ...trip,
      budgetLeft,
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Error fetching trip' });
  }
});

router.delete(
  '/:tripId',
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized. Please log in.' });
      return;
    }
    const userId = req.session.user.id;
    const { tripId } = req.params;
    try {
      // Confirm trip belongs to the user
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId },
      });
      if (!trip) {
        res.status(404).json({ error: 'Trip not found or unauthorized' });
        return;
      }
      const deletedTrip = await prisma.trip.delete({
        where: { id: tripId },
      });
      res
        .status(200)
        .json({ message: 'Trip deleted successfully', trip: deletedTrip });
    } catch (error) {
      console.error('Error deleting trip:', error);
      res.status(500).json({ error: 'Error deleting trip' });
    }
  }
);

router.delete(
  '/expense/:expenseId',
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ error: 'Unauthorized. Please log in.' });
      return;
    }
    const userId = req.session.user.id;
    const { expenseId } = req.params;
    try {
      // Optionally, verify that the expense belongs to a trip owned by the user.
      const expense = await prisma.expense.findUnique({
        where: { id: expenseId },
        include: { trip: true },
      });
      if (!expense || expense.trip.userId !== userId) {
        res.status(404).json({ error: 'Expense not found or unauthorized' });
        return;
      }
      const deletedExpense = await prisma.expense.delete({
        where: { id: expenseId },
      });
      res
        .status(200)
        .json({
          message: 'Expense deleted successfully',
          expense: deletedExpense,
        });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Error deleting expense' });
    }
  }
);

export default router;
