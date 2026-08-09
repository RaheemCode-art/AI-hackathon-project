import express from 'express';
import { chatWithAI } from '../controllers/chatController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/ask', verifyJWT, chatWithAI);

export default router;