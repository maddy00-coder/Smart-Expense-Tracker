import express from 'express';
import { getMe, login, signup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, signupSchema } from '../validations/authValidation.js';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', protect, getMe);

export default router;
