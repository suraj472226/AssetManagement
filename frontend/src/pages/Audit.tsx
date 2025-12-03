import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, Loader2, ServerCrash, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LogAuditDialog from '@/components/LogAuditDialog';

// Define the shape of the data coming from the API
interface AuditLog {
  _id: string;
  asset: {
    name: string;
    assetID: string;
  };
  performedBy: {
    name: string;
  };
  action: 'Check-In' | 'Check-Out' | 'Audit' | 'Verification';
  status: 'Verified' | 'Pending' | 'Missing' | 'Concern';
  location: string;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function Audit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAudits = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/audit`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch audit logs');

        const data = await response.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudits();
  }, [token]);

  // Calculate stats dynamically
  const stats = {
    total: logs.length,
    verified: logs.filter(l => l.status === 'Verified').length,
    pending: logs.filter(l => l.status === 'Pending').length,
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Check-In': return 'bg-green-100 text-green-800 border-green-200';
      case 'Check-Out': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Audit': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg text-muted-foreground">Loading Audit Logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <ServerCrash className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Failed to load Audit Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Asset Audit</h1>
          <p className="text-muted-foreground">Track asset movement and verification history</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            Generate Report
          </Button>
          <Button className="bg-gradient-primary flex-1 sm:flex-none">
            <QrCode className="h-4 w-4 mr-2" />
            New Scan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Logs</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.verified}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Audit Activity</h2>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No audit logs found.</div>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {log.status === 'Missing' ? (
                       <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : (
                       <QrCode className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium">{log.asset?.name || 'Unknown Asset'}</p>
                      <Badge variant="outline">{log.asset?.assetID}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>By: {log.performedBy?.name || 'System'}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{log.location || 'No Location'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:block sm:text-right w-full sm:w-auto">
                  <Badge className={getActionColor(log.action)}>
                    {log.action}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}