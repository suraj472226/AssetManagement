import express from 'express';
import { getAuditLogs, logAudit } from '../controllers/auditController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAuditLogs)
  .post(logAudit);

export default router;