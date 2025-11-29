import express from 'express';
import { protect } from '../middleware/auth'; // Assuming you have these
import { 
  getMaintenanceRecords, 
  createMaintenanceRecord, 
  updateMaintenanceStatus 
} from '../controllers/maintenanceController';

const router = express.Router();

router.route('/')
  .get(protect, getMaintenanceRecords)
  .post(protect, createMaintenanceRecord);

router.route('/:id')
  .put(protect, updateMaintenanceStatus);

export default router;