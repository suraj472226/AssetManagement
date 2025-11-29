import { Request, Response } from 'express';
import Asset from '../models/Asset'; // Ensure your Asset model is correctly defined and imported

// Extend the default Request type to include the 'user' property from your auth middleware
interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
  };
}

/**
 * @desc    Get all assets
 * @route   GET /api/assets
 * @access  Private
 */
export const getAssets = async (req: AuthRequest, res: Response) => {
  try {
    // Fetch all assets from the database, sorting by the newest first
    const assets = await Asset.find({}).sort({ createdAt: -1 });

    if (!assets) {
      return res.status(404).json({ message: 'No assets found' });
    }

    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createAsset = async (req: Request, res: Response) => {
  try {
    const {
      assetID,
      serialNumber, // <-- ADDED
      name,
      category,
      status,
      purchaseDate,
      cost,
      location,
      department
    } = req.body;

    // --- UPDATED VALIDATION ---
    if (!assetID || !name || !category || !status || !serialNumber) { // <-- ADDED serialNumber
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check for existing assetID or serialNumber
    const assetExists = await Asset.findOne({ $or: [{ assetID }, { serialNumber }] });
    if (assetExists) {
      const field = assetExists.assetID === assetID ? 'ID' : 'Serial Number';
      return res.status(400).json({ message: `Asset with this ${field} already exists` });
    }

    const asset = new Asset({
      assetID,
      serialNumber, // <-- ADDED
      name,
      category,
      status,
      purchaseDate,
      cost,
      location,
      department,
    });

    const createdAsset = await asset.save();
    res.status(201).json(createdAsset);
  } catch (error: any) {
    // This will now catch the validation error and send a proper message
    if (error.name === 'ValidationError') {
      // Sending a more structured error message to the frontend
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error creating asset:', error); // Keep this for server-side debugging
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAvailableAssets = async (req: Request, res: Response) => {
  try {
    const availableAssets = await Asset.find({ status: 'available' });
    res.status(200).json(availableAssets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};