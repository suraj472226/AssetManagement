import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Asset } from '@/data/mockData'; // Reusing the Asset type definition

const API_BASE_URL = 'https://assetmanagement-8r1x.onrender.com/api';

interface NewRequestFormProps {
  onRequesAdded: (newRequest: any) => void;
  onClose: () => void;
}

export default function NewRequestForm({ onRequesAdded, onClose }: NewRequestFormProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('available');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Generic Request ("Request New Asset" tab)
  const [genericAssetType, setGenericAssetType] = useState('');
  const [genericReason, setGenericReason] = useState('');

  // State for Specific Request ("Request Available Asset" tab)
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [specificReason, setSpecificReason] = useState('');

  useEffect(() => {
    // Fetch available assets when the component mounts
    const fetchAvailableAssets = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/assets/available`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Could not load available assets.");
        const data = await response.json();
        setAvailableAssets(data);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    };
    fetchAvailableAssets();
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isSpecificRequest = activeTab === 'available';
    let payload = {};
    let isValid = false;

    if (isSpecificRequest) {
      payload = { specificAssetId: selectedAssetId, reason: specificReason };
      isValid = !!selectedAssetId && !!specificReason;
    } else {
      payload = { assetType: genericAssetType, reason: genericReason };
      isValid = !!genericAssetType && !!genericReason;
    }
    
    if (!isValid) {
        toast({ title: "Missing Information", description: "Please fill out all required fields for your request.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit request.');

      toast({ title: 'Request Submitted!', description: 'Your request has been sent for approval.' });
      onRequesAdded(data);
      onClose();
    } catch (error: any) {
      toast({ title: 'An Error Occurred', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="available" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Request Available Asset</TabsTrigger>
          <TabsTrigger value="generic">Request New Asset</TabsTrigger>
        </TabsList>
        <TabsContent value="available" className="py-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="select-asset">Select an Asset</Label>
                <Select onValueChange={setSelectedAssetId}>
                    <SelectTrigger id="select-asset"><SelectValue placeholder="Browse available assets..." /></SelectTrigger>
                    <SelectContent>
                        {availableAssets.length > 0 ? availableAssets.map(asset => (
                            <SelectItem key={asset._id} value={asset._id}>{asset.name} ({asset.assetID})</SelectItem>
                        )) : <div className="p-4 text-sm text-muted-foreground">No assets currently available.</div>}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="specificReason">Reason / Justification</Label>
                <Textarea id="specificReason" value={specificReason} onChange={(e) => setSpecificReason(e.target.value)} placeholder="Why do you need this specific asset?" rows={3} />
            </div>
        </TabsContent>
        <TabsContent value="generic" className="py-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="select-type">Asset Type</Label>
                <Select onValueChange={setGenericAssetType}>
                    <SelectTrigger id="select-type"><SelectValue placeholder="Select asset type..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="genericReason">Reason / Justification</Label>
                <Textarea id="genericReason" value={genericReason} onChange={(e) => setGenericReason(e.target.value)} placeholder="Describe the asset you need and why (e.g., 'Need a high-performance laptop for video editing')." rows={3} />
            </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Request
        </Button>
      </div>
    </form>
  );
}