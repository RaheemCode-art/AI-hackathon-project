import express from 'express';
import { getMessages, sendMessage } from '../controllers/supportController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyJWT);
router.get('/', getMessages);
router.post('/', sendMessage);

export default router;