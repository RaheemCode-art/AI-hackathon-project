import express from 'express';
import { generateFitnessPlan } from '../controllers/planController.js';
import Plan from '../models/Plan.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();


router.post('/generate', verifyJWT, generateFitnessPlan);


router.get('/', verifyJWT, async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user._id });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

export default router;