// backend/src/middleware/admin.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth'; // Assuming AuthenticatedRequest is exported from auth.ts

export const admin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if the user object exists (guaranteed if preceded by 'protect' middleware)
  // And check if the role is ADMIN
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an Admin');
  }
};