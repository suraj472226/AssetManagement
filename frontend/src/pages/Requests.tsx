import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2, ServerCrash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import NewRequestForm from '@/components/NewRequestForm';
import { Request as RequestType } from '@/data/mockData';

const API_BASE_URL = 'http://localhost:5000/api';

// Update the type to include MongoDB's _id
type LiveRequest = RequestType & { _id: string; reason: string };

export default function Requests() {
  const [requests, setRequests] = useState<LiveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const { toast } = useToast();
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/requests`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch requests.');
        const data = await response.json();
        setRequests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const updatedRequest = await response.json();
      if (!response.ok) throw new Error(updatedRequest.message || `Failed to ${status} the request.`);

      setRequests(prev => prev.map(req => (req._id === requestId ? { ...req, status } : req)));
      
      toast({ title: `Request ${status === 'approved' ? 'Approved' : 'Rejected'}` });
    } catch (error: any) {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleRequestAdded = (newRequest: LiveRequest) => {
    setRequests(prev => [newRequest, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">Loading Requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-destructive/10 rounded-lg">
        <ServerCrash className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h3 className="text-xl font-semibold text-destructive">Failed to Load Requests</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Asset Requests</h1>
          <p className="text-muted-foreground">Review and manage asset allocation requests</p>
        </div>
        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogTrigger asChild>
            <Button>New Request</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader><DialogTitle>Create Asset Request</DialogTitle></DialogHeader>
            <NewRequestForm onRequesAdded={handleRequestAdded} onClose={() => setIsNewRequestOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Column */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Pending</h2>
            <Badge variant="secondary">{pendingRequests.length}</Badge>
          </div>
          <div className="space-y-4">
            {pendingRequests.map(request => (
              <div key={request._id} className="p-4 bg-card border rounded-lg shadow-sm space-y-3">
                <div className="font-semibold">{request.employeeName}</div>
                <div className="text-sm text-muted-foreground">{request.department}</div>
                <div className="text-sm font-medium pt-1">{request.assetType}</div>
                <p className="text-sm text-muted-foreground border-l-2 pl-2">"{request.reason}"</p>
                {user?.role === 'ADMIN' && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(request._id, 'approved')}>Approve</Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleStatusUpdate(request._id, 'rejected')}>Reject</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Approved Column */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">Approved</h2>
            <Badge variant="secondary">{approvedRequests.length}</Badge>
          </div>
          <div className="space-y-4">
            {approvedRequests.map(request => (
              <div key={request._id} className="p-4 bg-card border-l-4 border-green-500 rounded-r-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{request.employeeName}</div>
                    <div className="text-sm text-muted-foreground">{request.department}</div>
                    <div className="text-sm font-medium mt-1">{request.assetType}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border border-green-300">Approved</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rejected Column */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-semibold">Rejected</h2>
            <Badge variant="secondary">{rejectedRequests.length}</Badge>
          </div>
          <div className="space-y-4">
            {rejectedRequests.map(request => (
              <div key={request._id} className="p-4 bg-card border-l-4 border-red-500 rounded-r-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{request.employeeName}</div>
                    <div className="text-sm text-muted-foreground">{request.department}</div>
                    <div className="text-sm font-medium mt-1">{request.assetType}</div>
                  </div>
                  <Badge variant="destructive">Rejected</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}