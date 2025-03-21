import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { OpenAI } from 'openai';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();
const MIN_BUDGET = 50;
const windowMsEnv = process.env.RATE_LIMIT_WINDOW_MS || '900000'; // Default: 15 mins
const maxRequestsEnv = process.env.RATE_LIMIT_MAX || '100';

export const travelSuggestionsLimiter = rateLimit({
  windowMs: parseInt(windowMsEnv, 10),
  max: parseInt(maxRequestsEnv, 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post(
  '/travel-suggestions',
  [
    travelSuggestionsLimiter,
    body('budget')
      .notEmpty()
      .withMessage('Budget is required')
      .isNumeric()
      .withMessage('Budget must be a number'),
    body('country')
      .notEmpty()
      .withMessage('Country is required')
      .isString()
      .withMessage('Country must be a string'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    if (!req.session.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { budget, country } = req.body;
    const budgetAmount = Number(budget);

    if (budgetAmount < MIN_BUDGET) {
      res
        .status(200)
        .json({ message: 'No destinations found within this budget.' });
      return;
    }

    const prompt = `I am currently in ${country} and have a budget of ${budgetAmount} CAD to spend on local attractions and experiences. Please provide exactly 5 suggestions for attractions or experiences within ${country} that fit within this budget. For each suggestion, include the following details on separate lines:
- Destination: The name of the attraction or experience.
- Reason: A brief explanation of why this attraction is affordable and attractive.
- Cost: The estimated cost for admission or experience (exclude flight costs, as I'm already in the country).
- Purchase Option: A link to tickets or where you can buy admission (if unavailable, state "no purchasing options available").

Format your answer as a bullet list with each suggestion clearly separated.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use this model
        messages: [
          {
            role: 'system',
            content:
              'You are a travel assistant that provides travel destination suggestions based on the user’s budget and current location. Your suggestions must be affordable, concise, and practical.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const suggestions = completion.choices[0].message?.content;

      if (!suggestions || suggestions.trim() === '') {
        res
          .status(200)
          .json({ message: 'No destinations found within this budget.' });
        return;
      }

      res.status(200).json({ suggestions });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res
        .status(500)
        .json({ error: 'Failed to generate travel suggestions.' });
    }
  }
);

export default router;