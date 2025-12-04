import { Router } from 'express';
import { getDashboardSummary, getReportData, generateReport } from '../controllers/reportController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

// Route for the Reports Page (This fixes the 404)
router.get('/', getReportData);

// Route for the Dashboard Widgets
router.get('/dashboard-summary', getDashboardSummary);

// Route for specific generation (optional)
router.get('/generate', generateReport);

export default router;