import { Request, Response, NextFunction } from 'express';

export function validate(req: Request, res: Response, next: NextFunction) {
  // Placeholder validate - replace with express-validator / joi logic
  next();
}
