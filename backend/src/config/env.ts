// backend/src/config/env.ts

import dotenv from 'dotenv';

export function initEnv() {
  dotenv.config();
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || '4000';
