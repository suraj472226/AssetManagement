import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Maintenance from '../models/Maintenance';
import Asset from '../models/Asset';

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
export const getMaintenanceRecords = asyncHandler(async (req: Request, res: Response) => {
  // .populate('asset') fills in the Asset details (name, serial number) automatically
  const records = await Maintenance.find()
    .populate('asset', 'name assetID serialNumber location') 
    .sort({ createdAt: -1 });

  res.json(records);
});

// @desc    Create a new maintenance ticket
// @route   POST /api/maintenance
// @access  Private
export const createMaintenanceRecord = asyncHandler(async (req: Request, res: Response) => {
  const { assetId, issue, priority, assignedTo, description, scheduledDate } = req.body;

  // 1. Check if asset exists
  const asset = await Asset.findById(assetId);
  if (!asset) {
    res.status(404);
    throw new Error('Asset not found');
  }

  // 2. Create the maintenance record
  const maintenance = await Maintenance.create({
    asset: assetId,
    issue,
    description,
    priority,
    assignedTo,
    scheduledDate,
    status: 'scheduled'
  });

  // 3. Update the Asset status to 'maintenance' automatically
  asset.status = 'maintenance';
  await asset.save();

  res.status(201).json(maintenance);
});

// @desc    Update maintenance status (e.g., to 'completed')
// @route   PUT /api/maintenance/:id
// @access  Private
export const updateMaintenanceStatus = asyncHandler(async (req: Request, res: Response) => {
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
    
    // If maintenance is done, free up the asset
    const asset = await Asset.findById(maintenance.asset);
    if (asset) {
      asset.status = 'available'; // Set back to available
      await asset.save();
    }
  }

  const updatedRecord = await maintenance.save();
  res.json(updatedRecord);
});