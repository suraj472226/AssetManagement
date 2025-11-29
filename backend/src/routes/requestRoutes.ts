import { Router } from 'express';
import { getRequests, createRequest, updateRequestStatus } from '../controllers/requestController';
import { protect } from '../middleware/auth';

const router = Router();

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(getRequests)
  .post(createRequest);

// Route for updating the status of a specific request
router.put('/:id/status', updateRequestStatus);

export default router;