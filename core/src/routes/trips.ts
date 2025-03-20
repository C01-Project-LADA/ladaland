import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Trip name is required'),
    body('startDate').notEmpty().withMessage('Start date is required'),
    body('endDate').notEmpty().withMessage('End date is required'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    body('expenses').optional().isArray().withMessage('Expenses must be an array'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { name, startDate, endDate, budget, completed, expenses } = req.body;
    try {
      const trip = await prisma.trip.create({
        data: {
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
    param('tripId').notEmpty().withMessage('Trip ID is required'),
    body('name').optional().notEmpty().withMessage('Trip name cannot be empty'),
    body('startDate').optional().notEmpty().withMessage('Start date cannot be empty'),
    body('endDate').optional().notEmpty().withMessage('End date cannot be empty'),
    body('budget').optional().isNumeric().withMessage('Budget must be a number'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    body('expenses').optional().isArray().withMessage('Expenses must be an array'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
       res.status(400).json({ errors: errors.array() });
       return;
    }
    const { tripId } = req.params;
    const { name, startDate, endDate, budget, completed, expenses } = req.body;
    try {
      const trip = await prisma.trip.update({
        where: { id: tripId },
        data: {
          name,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          budget,
          completed,
        },
        include: { expenses: true },
      });

      if (expenses && Array.isArray(expenses)) {
        for (const exp of expenses) {
          if (exp.id) {
            await prisma.expense.update({
              where: { id: exp.id },
              data: {
                type: exp.type,
                name: exp.name,
                cost: exp.cost,
              },
            });
          } else {
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
  try {
    const trips = await prisma.trip.findMany({
      include: { expenses: true },
    });
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Error fetching trips' });
  }
});

router.delete('/:tripId', async (req: Request, res: Response): Promise<void> => {
  const { tripId } = req.params;
  try {
    const deletedTrip = await prisma.trip.delete({
      where: { id: tripId },
    });
    res.status(200).json({ message: 'Trip deleted successfully', trip: deletedTrip });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Error deleting trip' });
  }
});

router.delete('/expense/:expenseId', async (req: Request, res: Response): Promise<void> => {
  const { expenseId } = req.params;
  try {
    const deletedExpense = await prisma.expense.delete({
      where: { id: expenseId },
    });
    res.status(200).json({ message: 'Expense deleted successfully', expense: deletedExpense });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Error deleting expense' });
  }
});

export default router;