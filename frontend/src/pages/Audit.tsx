// fluid-asset-flow/src/pages/Audit.tsx
import { QrCode, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockAuditLogs = [
  {
    id: 1,
    assetID: 'FLUID-IT-001',
    assetName: 'Dell Latitude 5430',
    action: 'Check-In',
    user: 'Amit Sharma',
    timestamp: '2024-01-20 14:30:00',
    location: 'Bangalore Office - 3rd Floor',
  },
  {
    id: 2,
    assetID: 'FLUID-IT-003',
    assetName: 'Dell UltraSharp Monitor',
    action: 'Check-Out',
    user: 'Priya Patel',
    timestamp: '2024-01-20 11:15:00',
    location: 'IT Storage Room',
  },
  {
    id: 3,
    assetID: 'FLUID-IT-008',
    assetName: 'Samsung Galaxy S23',
    action: 'Check-In',
    user: 'Anjali Desai',
    timestamp: '2024-01-19 16:45:00',
    location: 'Operations Team',
  },
];

export default function Audit() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Asset Audit</h1>
          <p className="text-muted-foreground">QR-based asset tracking and verification</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            QR Codes
          </Button>
          <Button className="bg-gradient-primary flex-1 sm:flex-none">
            <QrCode className="h-4 w-4 mr-2" />
            Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">247</p>
              <p className="text-sm text-muted-foreground">Total Audited</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">238</p>
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
              <p className="text-2xl font-bold">9</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Audit Activity</h2>
        <div className="space-y-4">
          {mockAuditLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{log.assetName}</p>
                    <Badge variant="outline">{log.assetID}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{log.user}</span>
                    <span>•</span>
                    <span>{log.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={log.action === 'Check-In' ? 'bg-success' : 'bg-primary'}>
                  {log.action}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
