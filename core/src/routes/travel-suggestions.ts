import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { OpenAI } from 'openai';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();
const MIN_BUDGET = 200;
const windowMsEnv = process.env.RATE_LIMIT_WINDOW_MS || '900000'; // Default: 15 mins
const maxRequestsEnv = process.env.RATE_LIMIT_MAX || '100';       // Default: 100 requests

export const travelSuggestionsLimiter = rateLimit({
  windowMs: parseInt(windowMsEnv, 10),
  max: parseInt(maxRequestsEnv, 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.'
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

    const { budget } = req.body;
    const budgetAmount = Number(budget);

    if (budgetAmount < MIN_BUDGET) {
      res.status(200).json({ message: 'No destinations found within this budget.' });
      return;
    }

    const prompt = `Suggest a list of travel destinations that can be explored on a budget of ${budgetAmount} CAD. For each destination, provide a brief description explaining why it is affordable and attractive. Format the answer as a bullet list.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',  // Use this model
            messages: [
                {
                    role: 'system',
                    content: 'You are a travel assistant that provides travel destination suggestions based on the user’s budget. Your suggestions must be affordable, concise, and practical.'
                },
                {
                    role: 'user',
                    content: `I have a budget of ${budgetAmount} CAD. Please suggest travel destinations that fit within this budget and explain briefly why each is a good option.`
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        });          

      const suggestions = completion.choices[0].message?.content;

      if (!suggestions || suggestions.trim() === '') {
        res.status(200).json({ message: 'No destinations found within this budget.' });
        return;
      }

      res.status(200).json({ suggestions });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).json({ error: 'Failed to generate travel suggestions.' });
    }
  }
);

export default router;