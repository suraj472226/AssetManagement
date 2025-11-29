import { Router } from 'express';
// Make sure to import getAvailableAssets
import { getAssets, createAsset, getAvailableAssets } from '../controllers/assetController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAssets)
  .post(createAsset);

// Add the new route for fetching available assets
router.get('/available', getAvailableAssets);

export default router;