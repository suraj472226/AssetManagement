import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Asset } from '@/data/mockData';

const API_BASE_URL = 'http://localhost:5000/api';

interface AddAssetFormProps {
  onAssetAdded: (newAsset: Asset) => void;
  onClose: () => void;
}

export default function AddAssetForm({ onAssetAdded, onClose }: AddAssetFormProps) {
  // Form state
  const [assetID, setAssetID] = useState('');
  const [serialNumber, setSerialNumber] = useState(''); // <-- ADDED STATE
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { token } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetID,
          serialNumber, // <-- ADDED TO PAYLOAD
          name,
          category,
          status,
          cost: cost ? Number(cost) : undefined,
          location,
          purchaseDate: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create the asset.');
      }

      toast({
        title: 'Asset Created!',
        description: `Successfully added "${data.name}" to the inventory.`,
      });
      
      onAssetAdded(data);
      onClose();

    } catch (error: any) {
      toast({
        title: 'An Error Occurred',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assetID">Asset ID</Label>
          <Input id="assetID" value={assetID} onChange={(e) => setAssetID(e.target.value)} placeholder="e.g., FLUID-IT-011" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Asset Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Dell Latitude 5440" required />
        </div>
      </div>
      
      {/* --- ADDED THIS SECTION --- */}
      <div className="space-y-2">
        <Label htmlFor="serialNumber">Serial Number</Label>
        <Input id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="e.g., 9M4J1Y3" required />
      </div>
      {/* --- END ADDED SECTION --- */}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={setCategory} value={category} required>
            <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Laptop">Laptop</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="Server">Server</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={setStatus} value={status} required>
            <SelectTrigger id="status"><SelectValue placeholder="Select a status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cost">Cost (INR)</Label>
          <Input id="cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g., 85000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., IT Storage Room" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
          ) : (
            'Create Asset'
          )}
        </Button>
      </div>
    </form>
  );
}