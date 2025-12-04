import { Request, Response } from 'express';
import Asset from '../models/Asset';
import Maintenance from '../models/Maintenance';

/**
 * @desc    Get aggregated data for the main dashboard (Home Page)
 * @route   GET /api/reports/dashboard-summary
 */
export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const summary = await Asset.aggregate([
      {
        $facet: {
          totalAssets: [{ $count: 'count' }],
          assetsByStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { name: '$_id', value: '$count', _id: 0 } }
          ],
          assetsByCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { name: '$_id', count: '$count', _id: 0 } }
          ],
          totalValue: [{ $group: { _id: null, total: { $sum: '$cost' } } }],
          inUseCount: [{ $match: { status: 'in-use' } }, { $count: 'count' }],
          upcomingExpiries: [
            { $match: { warrantyEnd: { $lte: thirtyDaysFromNow, $gte: new Date() } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const data = summary[0];
    const totalAssetsCount = data.totalAssets[0]?.count || 0;
    const inUseAssetsCount = data.inUseCount[0]?.count || 0;

    res.status(200).json({
      totalAssets: totalAssetsCount,
      utilizationRate: totalAssetsCount > 0 ? parseFloat(((inUseAssetsCount / totalAssetsCount) * 100).toFixed(1)) : 0,
      upcomingExpiries: data.upcomingExpiries[0]?.count || 0,
      totalValue: data.totalValue[0]?.total || 0,
      assetsByStatus: data.assetsByStatus || [],
      assetsByCategory: data.assetsByCategory || [],
    });

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get raw data for Reports Page (CSV Export & Analytics)
 * @route   GET /api/reports
 */
export const getReportData = async (req: Request, res: Response) => {
  try {
    // 1. Fetch raw data for CSV export
    const assets = await Asset.find({}).sort({ createdAt: -1 });
    const maintenance = await Maintenance.find({}).sort({ createdAt: -1 });

    // 2. Calculate Stats for Report Cards
    const totalValue = assets.reduce((sum, asset) => sum + (asset.cost || 0), 0);
    const availableCount = assets.filter(a => a.status === 'available').length;
    const maintenanceCount = maintenance.filter(m => m.status !== 'completed').length;

    res.status(200).json({
      stats: {
        totalAssets: assets.length,
        totalValue,
        maintenanceCount
      },
      rawAssets: assets,       // Needed for "Export Assets CSV"
      rawMaintenance: maintenance // Needed for "Export Maintenance CSV"
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const generateReport = async (req: Request, res: Response) => {
    res.status(501).json({ message: 'Not implemented' });
};