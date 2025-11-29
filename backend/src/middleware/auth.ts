// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend the Express Request interface for type safety in controllers
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: 'Bearer TOKEN')
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Get user from the token's payload (the ID) and exclude the password hash
      const user = await User.findById(decoded.id).select('-passwordHash');

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Attach user to the request object for access in controllers
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});