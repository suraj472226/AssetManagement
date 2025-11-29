import { Wrench, Calendar, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockMaintenanceTasks = [
  {
    id: 1,
    assetID: 'FLUID-IT-005',
    assetName: 'Lenovo ThinkPad X1',
    issue: 'Battery replacement required',
    status: 'open',
    priority: 'high',
    reportedDate: '2024-01-15',
    assignedTo: 'Tech Support Team',
  },
  {
    id: 2,
    assetID: 'FLUID-IT-012',
    assetName: 'Dell Monitor U2720Q',
    issue: 'Screen flickering',
    status: 'in-progress',
    priority: 'medium',
    reportedDate: '2024-01-18',
    assignedTo: 'Hardware Team',
  },
  {
    id: 3,
    assetID: 'FLUID-IT-008',
    assetName: 'Samsung Galaxy S23',
    issue: 'Charging port damage',
    status: 'open',
    priority: 'high',
    reportedDate: '2024-01-20',
    assignedTo: 'Mobile Support',
  },
];

export default function Maintenance() {
  const statusConfig = {
    open: { label: 'Open', className: 'bg-warning text-warning-foreground' },
    'in-progress': { label: 'In Progress', className: 'bg-primary text-primary-foreground' },
    closed: { label: 'Closed', className: 'bg-success text-success-foreground' },
  };

  const priorityConfig = {
    high: { className: 'bg-destructive text-destructive-foreground' },
    medium: { className: 'bg-warning text-warning-foreground' },
    low: { className: 'bg-muted text-muted-foreground' },
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Track and manage asset repairs</p>
        </div>
        <Button className="bg-gradient-primary w-full sm:w-auto">
          Schedule Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {mockMaintenanceTasks.map((task) => (
          <Card key={task.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{task.assetName}</h3>
                  <Badge variant="outline">{task.assetID}</Badge>
                  <Badge className={priorityConfig[task.priority as keyof typeof priorityConfig].className}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3">{task.issue}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Reported: {new Date(task.reportedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusConfig[task.status as keyof typeof statusConfig].className}>
                  {statusConfig[task.status as keyof typeof statusConfig].label}
                </Badge>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
