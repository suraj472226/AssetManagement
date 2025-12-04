import express from 'express';
import { analyzeIssue } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Protected route (users must be logged in to use AI)
router.post('/analyze', protect, analyzeIssue);

export default router;