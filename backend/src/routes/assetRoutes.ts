// backend/src/routes/assetRoutes.ts
import { Router } from 'express';
import { 
  getAssets, 
  createAsset, 
  getAvailableAssets 
} from '../controllers/assetController';
import { protect, admin } from '../middleware/auth'; // <--- Import admin middleware

const router = Router();

// Apply 'protect' to all routes in this file (must be logged in)
router.use(protect);

router.route('/')
  .get(getAssets)       // Accessible by All (Controller handles filtering)
  .post(admin, createAsset); // <--- PROTECTED: Only Admin can create

// Helper route
router.get('/available', getAvailableAssets);

export default router;