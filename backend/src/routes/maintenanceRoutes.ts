import express from 'express';
import { protect, admin } from '../middleware/auth';
import { 
  getMaintenanceRecords, 
  createMaintenanceRecord, 
  updateMaintenanceStatus 
} from '../controllers/maintenanceController';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMaintenanceRecords)       // Filtered by controller
  .post(createMaintenanceRecord);   // Employees can report issues

router.route('/:id')
  .put(updateMaintenanceStatus);    // Controller checks for Admin role

export default router;