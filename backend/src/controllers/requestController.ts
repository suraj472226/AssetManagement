// backend/src/controllers/requestController.ts
import { Request as ExpressRequest, Response } from 'express';
import RequestModel from '../models/Request';
import Asset from '../models/Asset';

// Interface for the Auth Request
interface AuthRequest extends ExpressRequest {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
    department?: string;
  };
}

/**
 * @desc    Get requests (Admin: All, Employee: Theirs)
 * @route   GET /api/requests
 * @access  Private
 */
export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'User not found' });

    let requests;

    if (user.role === 'ADMIN') {
      // 👑 Admin: See ALL requests
      requests = await RequestModel.find({}).sort({ createdAt: -1 });
    } else {
      // 👤 Employee: See ONLY their own requests
      requests = await RequestModel.find({ requestedBy: user._id }).sort({ createdAt: -1 });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new asset request
 * @route   POST /api/requests
 * @access  Private
 */
export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { assetType, reason, specificAssetId } = req.body;
        
        if ((!assetType && !specificAssetId) || !reason) {
            return res.status(400).json({ message: 'Request details and reason are required.' });
        }
        
        const user = req.user!;
        let finalAssetType = assetType;

        // If requesting a specific asset, fetch its details
        if (specificAssetId) {
            const asset = await Asset.findById(specificAssetId);
            if (!asset || asset.status !== 'available') {
                return res.status(400).json({ message: 'This asset is not available for request.' });
            }
            finalAssetType = asset.category;
        }

        const newRequest = new RequestModel({
            assetType: finalAssetType,
            reason,
            specificAsset: specificAssetId || null,
            requestedBy: user._id,
            employeeName: user.name,
            department: user.department || 'General',
            requestID: `REQ-${Date.now().toString().slice(-6)}`, // Shorter ID
            status: 'pending',
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);

    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update status (Admin Only)
 * @route   PUT /api/requests/:id/status
 * @access  Private/Admin
 */
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }
        
        // Extra check (though middleware should handle this)
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized.' });
        }

        const request = await RequestModel.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        request.status = status;
        
        // --- AUTOMATION: Assign asset if approved ---
        if (status === 'approved' && request.specificAsset) {
            await Asset.updateOne(
                { _id: request.specificAsset },
                {
                    $set: {
                        status: 'in-use',
                        currentOwner: request.employeeName // Assign to requester
                    }
                }
            );
        }

        await request.save();
        res.status(200).json(request);

    } catch (error) {
        console.error("Error updating request:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};