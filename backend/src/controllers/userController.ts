// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Helper function to generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // Debug: log incoming method/url, headers and body to help diagnose empty payloads
  // (remove these logs once the issue is resolved)
  // eslint-disable-next-line no-console
  console.log(new Date().toISOString(), 'registerUser -', req.method, req.originalUrl);
  // eslint-disable-next-line no-console
  console.log('registerUser - headers:', { 'content-type': req.headers['content-type'], authorization: req.headers['authorization'] });
  // eslint-disable-next-line no-console
  console.log('registerUser - raw body:', req.body);

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please enter all required fields: name, email, password, role');
  }
  
  // Validate Role
  if (!['ADMIN', 'EMPLOYEE'].includes(role.toUpperCase())) {
     res.status(400);
     throw new Error('Invalid role specified. Must be ADMIN or EMPLOYEE.');
  }

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });
  // eslint-disable-next-line no-console
  console.log('registerUser - userExists:', Boolean(userExists));

  if (userExists) {
    // Return 409 Conflict for existing user instead of throwing an exception
    res.status(409).json({ message: 'User already exists' });
    return;
  }

  // 2. Create user (passwordHash receives the plain password, which the pre-save hook hashes)
  let newUser;
  try {
    newUser = await User.create({
      name,
      email,
      passwordHash: password,
      role: role.toUpperCase() as UserRole,
    });
    // eslint-disable-next-line no-console
    console.log('registerUser - created user id:', newUser?._id);
  } catch (createErr) {
    // eslint-disable-next-line no-console
    console.error('registerUser - creation error:', createErr);
    throw createErr; // let asyncHandler / error middleware handle response
  }

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(String(newUser._id)),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });

  // 2. Check if user exists AND if password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(String(user._id)),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ... (Keep existing imports and generateToken function) ...

// ... (Keep registerUser and loginUser functions as they are) ...

// @desc    Get user data by ID
// @route   GET /api/users/:id
// @access  Private/Admin (Should be restricted to Admins or the user themselves)
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid User ID format');
  }
  
  // Find user by ID, excluding the password hash
  const user = await User.findById(userId).select('-passwordHash');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Get current user data (via token)
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404);
    throw new Error('User data not found');
  }
});

// REMOVE THE FOLLOWING TEMPORARY FUNCTION, IT IS NO LONGER NEEDED:
/*
export function getUser(arg0: string, getUser: any) {
    throw new Error('Function not implemented.');
}
*/