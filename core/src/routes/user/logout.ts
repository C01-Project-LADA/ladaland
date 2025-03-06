import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'You are not logged in.' });
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Failed to log out' });
    } else {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout successful' });
    }
  });
});

export default router;