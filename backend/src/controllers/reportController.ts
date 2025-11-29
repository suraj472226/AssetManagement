import { Request, Response } from 'express';
import Asset from '../models/Asset';

/**
 * @desc    Get aggregated data for the main dashboard
 * @route   GET /api/reports/dashboard-summary
 * @access  Private
 */
export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Using an aggregation pipeline to calculate all stats in a single query
    const summary = await Asset.aggregate([
      {
        $facet: {
          // 1. Calculate Total Assets
          totalAssets: [
            { $count: 'count' }
          ],
          // 2. Group assets by status for the pie chart
          assetsByStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { name: '$_id', value: '$count', _id: 0 } }
          ],
          // 3. Group assets by department for the bar chart
          // --- MODIFIED THIS SECTION ---
          // We now group by the 'category' field instead of 'department'.
          assetsByCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { name: '$_id', count: '$count', _id: 0 } }
          ],
          // --- END MODIFICATION ---
          // 4. Calculate total cost of all assets
          totalValue: [
            { $group: { _id: null, total: { $sum: '$cost' } } }
          ],
          // 5. Count assets that are 'in-use'
          inUseCount: [
            { $match: { status: 'in-use' } },
            { $count: 'count' }
          ],
          // 6. Count warranties expiring in the next 30 days
          upcomingExpiries: [
            {
              $match: {
                warrantyEnd: {
                  $lte: thirtyDaysFromNow,
                  $gte: new Date()
                }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    // Reformat the aggregated data into a clean object
    const totalAssetsCount = summary[0].totalAssets[0]?.count || 0;
    const inUseAssetsCount = summary[0].inUseCount[0]?.count || 0;

    const dashboardData = {
      totalAssets: totalAssetsCount,
      utilizationRate: totalAssetsCount > 0 ? parseFloat(((inUseAssetsCount / totalAssetsCount) * 100).toFixed(1)) : 0,
      upcomingExpiries: summary[0].upcomingExpiries[0]?.count || 0,
      totalValue: summary[0].totalValue[0]?.total || 0,
      assetsByStatus: summary[0].assetsByStatus,
      assetsByCategory: summary[0].assetsByCategory,
    };

    res.status(200).json(dashboardData);

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export function generateReport(arg0: string, generateReport: any) {
    throw new Error('Function not implemented.');
}
