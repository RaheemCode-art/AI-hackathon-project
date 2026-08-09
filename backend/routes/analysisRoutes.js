import express from 'express';
import { analyzeBodyImages } from '../controllers/analysisController.js';
import { verifyJWT } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/upload', verifyJWT, upload.array('images', 4), analyzeBodyImages);

export default router;