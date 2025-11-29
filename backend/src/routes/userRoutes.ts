// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import * as controller from '../controllers/userController';
import { protect } from '../middleware/auth';
// import { admin } from '../middleware/admin'; // We will create this middleware soon

const router = Router();

// --- Public Routes ---
router.post('/signup', controller.registerUser); // Matches frontend requirement
router.post('/login', controller.loginUser);

// --- Private Routes (Requires Token) ---
// Get data for the currently logged-in user
router.get('/me', protect, controller.getMe); 

// --- Private/Admin Routes ---
// Get data for a specific user (This should be restricted to ADMINs)
router.get('/:id', protect, /* ADD ADMIN MIDDLEWARE HERE LATER */ controller.getUserById);

export default router;