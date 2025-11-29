import { Request as ExpressRequest, Response } from 'express';
import Request from '../models/Request';
import Asset from '../models/Asset';
// Define a minimal AuthRequest-like type locally to avoid importing from middleware
type AuthRequest = ExpressRequest & { user?: { _id: string; name?: string; role?: string; department?: string } };

// A simple counter for generating request IDs (in a real app, use a more robust method)
let requestCounter = 100;

/**
 * @desc    Get all asset requests
 * @route   GET /api/requests
 * @access  Private
 */
export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    // Sort by most recent first
    const requests = await Request.find({}).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new asset request (handles both specific and generic)
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
            finalAssetType = asset.category; // Use the category of the specific asset
        }

        const newRequest = new Request({
            assetType: finalAssetType,
            reason,
            specificAsset: specificAssetId, // Will be null for generic requests
            requestedBy: user._id,
            employeeName: user.name,
            department: user.department || 'General',
            requestID: `REQ-${Date.now()}`,
            status: 'pending',
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update a request's status (with automation)
 * @route   PUT /api/requests/:id/status
 * @access  Private (Admin/Manager only)
 */
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }
        
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized.' });
        }

        const request = await Request.findById(id).populate('requestedBy');
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        request.status = status;
        
        // --- AUTOMATION LOGIC ---
        // If a request for a specific asset is approved, assign it!
        if (status === 'approved' && request.specificAsset) {
            await Asset.updateOne(
                { _id: request.specificAsset },
                {
                    $set: {
                        status: 'in-use',
                        currentOwner: request.employeeName
                    }
                }
            );
        }
        // --- END AUTOMATION ---

        await request.save();
        res.status(200).json(request);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};