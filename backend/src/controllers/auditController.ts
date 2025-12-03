import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Audit from '../models/Audit';
import Asset from '../models/Asset';

// Interface for Auth Request
interface AuthRequest extends Request {
  user?: { _id: string; name: string };
}

// @desc    Get all audit logs
// @route   GET /api/audit
// @access  Private
export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const logs = await Audit.find({})
    .populate('asset', 'name assetID serialNumber') // Get Asset details
    .populate('performedBy', 'name email')          // Get Admin/User details
    .sort({ createdAt: -1 });                       // Newest first

  res.json(logs);
});

// @desc    Create a new audit entry manually
// @route   POST /api/audit
// @access  Private
export const logAudit = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { assetId, action, status, location, notes } = req.body;

  // Verify asset exists
  const assetExists = await Asset.findById(assetId);
  if (!assetExists) {
    res.status(404);
    throw new Error('Asset not found');
  }

  const log = await Audit.create({
    asset: assetId,
    performedBy: req.user?._id,
    action,
    status,
    location: location || assetExists.location, // Default to current asset location
    notes
  });

  // Optional: If 'Check-In' or 'Check-Out', you might want to update the Asset status too
  // But for now, we just log it.

  res.status(201).json(log);
});