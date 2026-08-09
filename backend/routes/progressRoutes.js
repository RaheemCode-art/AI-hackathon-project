import express from 'express';
import { logDailyProgress, logWeeklyProgress } from '../controllers/progressController.js';
import { verifyJWT } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/daily', verifyJWT, logDailyProgress);
router.post('/weekly', verifyJWT, upload.array('photos', 4), logWeeklyProgress);

export default router;