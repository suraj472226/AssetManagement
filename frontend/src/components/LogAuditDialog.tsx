import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Asset {
  _id: string;
  name: string;
  assetID: string;
}

interface LogAuditDialogProps {
  onSuccess: () => void; // To refresh the table
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function LogAuditDialog({ onSuccess }: LogAuditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  
  // Form State
  const [selectedAsset, setSelectedAsset] = useState('');
  const [action, setAction] = useState('Audit');
  const [status, setStatus] = useState('Verified');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const { token } = useAuth();
  const { toast } = useToast();

  // 1. Fetch Assets for the dropdown
  useEffect(() => {
    if (open && token) {
      fetch(`${API_BASE_URL}/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setAssets(data))
      .catch(err => console.error(err));
    }
  }, [open, token]);

  // 2. Submit the Log
  const handleSubmit = async () => {
    if (!selectedAsset) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          assetId: selectedAsset,
          action,
          status,
          location, 
          notes
        })
      });

      if (!response.ok) throw new Error('Failed to save log');

      toast({ title: 'Audit Logged', description: 'Verification recorded successfully.' });
      setOpen(false);
      onSuccess(); // Refresh the parent page
      
      // Reset form
      setNotes('');
      setLocation('');
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive', description: 'Could not save log' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary">
           New Scan / Log
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Manual Audit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          
          {/* Asset Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Asset</label>
            <Select onValueChange={setSelectedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Search asset..." />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset._id} value={asset._id}>
                    {asset.assetID} - {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Action Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select onValueChange={setAction} defaultValue="Audit">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Audit">Routine Audit</SelectItem>
                  <SelectItem value="Check-In">Check-In</SelectItem>
                  <SelectItem value="Check-Out">Check-Out</SelectItem>
                  <SelectItem value="Verification">Spot Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Outcome */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Outcome</label>
              <Select onValueChange={setStatus} defaultValue="Verified">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verified">✅ Verified</SelectItem>
                  <SelectItem value="Pending">🕒 Pending</SelectItem>
                  <SelectItem value="Missing">❌ Missing</SelectItem>
                  <SelectItem value="Concern">⚠️ Damaged/Concern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Override */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Location (Optional)</label>
            <Input 
              placeholder="e.g. Server Room B" 
              value={location}
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea 
              placeholder="Any observations..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={loading || !selectedAsset}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Log'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}