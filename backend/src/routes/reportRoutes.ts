import { Router } from 'express';
import * as controller from '../controllers/reportController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/generate', controller.generateReport);
router.get('/dashboard-summary', controller.getDashboardSummary);

export default router;