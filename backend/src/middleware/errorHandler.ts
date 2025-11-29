// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

// Handles 404 errors (requests that didn't match any route)
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Generic error handler
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Use the status code already set by the route/controller, or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  // Also log the error server-side for easier debugging (dev only)
  // eslint-disable-next-line no-console
  console.error('Global error handler caught:', err);
  res.json({
    message: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};