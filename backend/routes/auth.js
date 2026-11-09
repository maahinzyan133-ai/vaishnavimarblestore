import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { currentAdmin, login, registerFirstAdmin } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

router.post('/login', loginLimiter, login);
router.post('/register', loginLimiter, registerFirstAdmin);
router.get('/me', requireAdmin, currentAdmin);

export default router;
