import { useState, useEffect } from 'react';
import { Search, Filter, Grid3x3, List, Loader2, ServerCrash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AssetCard from '@/components/AssetCard';
import AddAssetForm from '@/components/AddAssetForm';
import { useAuth } from '@/context/AuthContext';
import { Asset } from '@/data/mockData';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Assets() {
  // State for data, loading, and errors
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for UI controls
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  const { token } = useAuth();

  // Effect to fetch assets from the backend
  useEffect(() => {
    const fetchAssets = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/assets`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assets. The server might be down.');
        }

        const data = await response.json();
        setAssets(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [token]);

  // Client-side filtering logic (safe version)
const filteredAssets = assets.filter((asset) => {
  const name = asset.name?.toLowerCase() || '';
  const assetId = asset.assetID?.toLowerCase() || '';
  const owner = asset.currentOwner?.toLowerCase() || '';
  const category = asset.category?.toLowerCase() || '';
  const status = asset.status?.toLowerCase() || '';

  const query = searchQuery.toLowerCase();

  const matchesSearch =
    name.includes(query) ||
    assetId.includes(query) ||
    owner.includes(query) ||
    category.includes(query) ||
    status.includes(query);

  const matchesStatus = statusFilter === 'all' || status === statusFilter.toLowerCase();
  const matchesCategory = categoryFilter === 'all' || category === categoryFilter.toLowerCase();

  return matchesSearch && matchesStatus && matchesCategory;
});

  // Handler to update UI instantly after an asset is added
  const handleAssetAdded = (newAsset: Asset) => {
    setAssets(prevAssets => [newAsset, ...prevAssets]);
  };

  // --- Conditional Rendering ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg font-medium text-muted-foreground">Loading Assets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive-foreground bg-destructive/90 rounded-lg">
        <ServerCrash className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to Load Data</h3>
        <p>{error}</p>
      </div>
    );
  }
  // --- End Conditional Rendering ---

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Assets Inventory</h1>
          <p className="text-muted-foreground">Browse, search, and manage your IT assets.</p>
        </div>
        <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary w-full sm:w-auto">Add New Asset</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a New Asset</DialogTitle>
            </DialogHeader>
            <AddAssetForm
              onAssetAdded={handleAssetAdded}
              onClose={() => setIsAddAssetOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID, or owner..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Laptop">Laptop</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="Server">Server</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid3x3 className="h-4 w-4" /></Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing <strong>{filteredAssets.length}</strong> of <strong>{assets.length}</strong> total assets
      </div>

      {/* Assets Grid or List */}
      {filteredAssets.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredAssets.map((asset) => (
            <AssetCard key={asset._id || asset.assetID} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Assets Found</h3>
          <p className="text-muted-foreground">Your search or filter criteria did not match any assets.</p>
        </div>
      )}
    </div>
  );
}