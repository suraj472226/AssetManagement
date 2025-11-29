// backend/src/controllers/assetController.ts
import { Request, Response } from 'express';
import Asset from '../models/Asset';

// Interface to type the User object on the Request
interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
  };
}

/**
 * @desc    Get assets (Admin sees ALL, Employee sees THEIRS)
 * @route   GET /api/assets
 * @access  Private
 */
export const getAssets = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    let assets;

    if (user.role === 'ADMIN') {
      // 👑 ADMIN: Fetch EVERYTHING
      assets = await Asset.find({}).sort({ createdAt: -1 });
    } else {
      // 👤 EMPLOYEE: Return ALL assets but hide sensitive fields like cost and purchaseDate
      // This allows employees to browse the inventory while keeping sensitive info hidden.
      assets = await Asset.find({})
        .select('-cost -purchaseDate') // Hide sensitive fields for non-admins
        .sort({ createdAt: -1 });
    }

    if (!assets) {
      return res.status(404).json({ message: 'No assets found' });
    }

    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new asset
 * @route   POST /api/assets
 * @access  Private (Admin Only)
 */
export const createAsset = async (req: Request, res: Response) => {
  try {
    const {
      assetID,
      serialNumber,
      name,
      category,
      status,
      purchaseDate,
      cost,
      location,
      department,
      currentOwner
    } = req.body;

    // Validation
    if (!assetID || !name || !category || !status || !serialNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check for duplicates
    const assetExists = await Asset.findOne({ $or: [{ assetID }, { serialNumber }] });
    if (assetExists) {
      const field = assetExists.assetID === assetID ? 'ID' : 'Serial Number';
      return res.status(400).json({ message: `Asset with this ${field} already exists` });
    }

    const asset = new Asset({
      assetID,
      serialNumber,
      name,
      category,
      status,
      purchaseDate,
      cost,
      location,
      department,
      currentOwner // Added this so you can assign directly on creation
    });

    const createdAsset = await asset.save();
    res.status(201).json(createdAsset);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error creating asset:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get assets available for assignment
 * @route   GET /api/assets/available
 * @access  Private
 */
export const getAvailableAssets = async (req: Request, res: Response) => {
  try {
    // Only return minimal info for the dropdowns
    const availableAssets = await Asset.find({ status: 'available' })
      .select('assetID name serialNumber'); 
    res.status(200).json(availableAssets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};