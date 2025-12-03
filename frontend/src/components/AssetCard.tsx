// fluid-asset-flow/src/components/AssetCard.tsx
import { Package, Calendar, User, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  'in-use': { label: 'In Use', className: 'bg-primary text-primary-foreground' },
  'available': { label: 'Available', className: 'bg-success text-success-foreground' },
  'maintenance': { label: 'Maintenance', className: 'bg-warning text-warning-foreground' },
  'retired': { label: 'Retired', className: 'bg-muted text-muted-foreground' },
};

// ✅ Safe wrapper function for fallback
const getStatusInfo = (status?: string) => {
  const key = status?.toLowerCase();
  return statusConfig[key!] || { label: 'Unknown', className: 'bg-gray-200 text-gray-700' };
};

export default function AssetCard({ asset, onClick }: AssetCardProps) {
  const statusInfo = getStatusInfo(asset.status);

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // ✅ Safe parsing for optional fields
  const warrantyDate = asset.warrantyEnd
    ? new Date(asset.warrantyEnd).toLocaleDateString()
    : 'N/A';

  const formattedCost = asset.cost
    ? `₹${asset.cost.toLocaleString()}`
    : 'N/A';

  return (
    <Card
      className="p-5 hover:shadow-lg transition-all cursor-pointer group animate-fade-in relative overflow-hidden"
      onClick={onClick}
    >
      {/* Status Badge */}
      <div
        className={cn(
          'absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg',
          statusInfo.className
        )}
      >
        {statusInfo.label}
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* Top section */}
        <div className="flex items-start gap-3 mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
              {asset.name || 'Unnamed Asset'}
            </h3>
            <p className="text-sm text-muted-foreground">{asset.assetID || 'N/A'}</p>
          </div>
        </div>

        {/* Middle Info Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {asset.currentOwner || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {asset.location || 'Unknown Location'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Warranty: {warrantyDate}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <Badge variant="secondary">{asset.category || 'Miscellaneous'}</Badge>
          {isAdmin ? <span className="text-sm font-medium">{formattedCost}</span> : null}
        </div>
      </div>
    </Card>
  );
}
