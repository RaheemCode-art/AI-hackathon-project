import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyJWT, getProfile);
router.put('/profile', verifyJWT, updateProfile);

export default router;