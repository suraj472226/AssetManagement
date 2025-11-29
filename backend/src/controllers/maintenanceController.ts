import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Maintenance from '../models/Maintenance';
import Asset from '../models/Asset';
import { AuthenticatedRequest } from '../middleware/auth';

// @desc    Get maintenance records (Admin: All, Employee: Theirs)
// @route   GET /api/maintenance
// @access  Private
export const getMaintenanceRecords = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  let records;

  if (user.role === 'ADMIN') {
    // 👑 Admin: See ALL maintenance records
    records = await Maintenance.find()
      .populate('asset', 'name assetID serialNumber location')
      .sort({ createdAt: -1 });
  } else {
    // 👤 Employee: See only records for THEIR assigned assets
    
    // 1. Find all assets belonging to this user
    const userAssets = await Asset.find({ 
      $or: [{ currentOwner: user.email }, { currentOwner: user.name }] 
    });
    
    // 2. Extract the IDs
    const assetIds = userAssets.map(asset => asset._id);

    // 3. Find maintenance records linked to those Asset IDs
    records = await Maintenance.find({ asset: { $in: assetIds } })
      .populate('asset', 'name assetID serialNumber')
      .sort({ createdAt: -1 });
  }

  res.json(records);
});

// @desc    Create a new maintenance ticket
// @route   POST /api/maintenance
// @access  Private
export const createMaintenanceRecord = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { assetId, issue, priority, assignedTo, description, scheduledDate } = req.body;

  const asset = await Asset.findById(assetId);
  if (!asset) {
    res.status(404);
    throw new Error('Asset not found');
  }

  // Optional: Prevent employees from scheduling maintenance for assets they don't own
  if (req.user?.role !== 'ADMIN' && 
      asset.currentOwner !== req.user?.email && 
      asset.currentOwner !== req.user?.name) {
      res.status(403);
      throw new Error('You can only report issues for your own assets');
  }

  const maintenance = await Maintenance.create({
    asset: assetId,
    issue,
    description,
    priority,
    assignedTo,
    scheduledDate,
    status: 'scheduled'
  });

  // Update Asset Status
  asset.status = 'maintenance';
  await asset.save();

  res.status(201).json(maintenance);
});

// @desc    Update maintenance status (e.g., to 'completed')
// @route   PUT /api/maintenance/:id
// @access  Private/Admin
export const updateMaintenanceStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Security: Only Admin can update status (Employees can't mark their own laptop as "fixed")
  if (req.user?.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Not authorized. Only Admins can update maintenance status.');
  }

  const { status, cost, completionDate } = req.body;
  
  const maintenance = await Maintenance.findById(req.params.id);

  if (!maintenance) {
    res.status(404);
    throw new Error('Maintenance record not found');
  }

  maintenance.status = status || maintenance.status;
  maintenance.cost = cost || maintenance.cost;
  
  if (status === 'completed') {
    maintenance.completionDate = completionDate || new Date();
    
    // Free up the asset
    const asset = await Asset.findById(maintenance.asset);
    if (asset) {
      asset.status = 'available'; // OR 'in-use' if you want to give it back to owner immediately
      await asset.save();
    }
  }

  const updatedRecord = await maintenance.save();
  res.json(updatedRecord);
});