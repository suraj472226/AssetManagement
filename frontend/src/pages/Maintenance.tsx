import { useEffect, useState } from 'react';
import { Wrench, Calendar, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScheduleMaintenanceDialog } from '@/components/ScheduleMaintenanceDialog';

// Define the interface matching backend response
interface MaintenanceRecord {
  _id: string;
  asset: {
    _id: string;
    name: string;
    assetID: string;
  };
  issue: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  scheduledDate: string;
  createdAt: string;
}

export default function Maintenance() {
  const [tasks, setTasks] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance records', error);
      toast({ title: 'Error', description: 'Failed to load maintenance records', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  // Handler to mark task as completed
  const handleCompleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
      
      if(res.ok) {
        toast({ title: 'Success', description: 'Maintenance marked as completed' });
        fetchMaintenance(); // Refresh list
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  // Calculate stats dynamically
  const stats = {
    open: tasks.filter(t => t.status === 'scheduled').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const priorityColors = {
    high: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    medium: 'bg-orange-500 text-white hover:bg-orange-600',
    low: 'bg-slate-500 text-white hover:bg-slate-600',
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Track and manage asset repairs</p>
        </div>
        {/* Pass the refresh function to the dialog */}
        <ScheduleMaintenanceDialog onSuccess={fetchMaintenance} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.open}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
           <div className="text-center py-10 text-muted-foreground">No maintenance records found.</div>
        ) : (
          tasks.map((task) => (
            <Card key={task._id} className="p-6 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{task.asset?.name || 'Unknown Asset'}</h3>
                    <Badge variant="outline">{task.asset?.assetID}</Badge>
                    <Badge className={priorityColors[task.priority]}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-foreground font-medium mb-1">{task.issue}</p>
                  <p className="text-muted-foreground text-sm mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wrench className="h-4 w-4" />
                      <span>{task.assignedTo || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-start">
                  <Badge variant="secondary" className={statusColors[task.status]}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                  
                  {task.status !== 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCompleteTask(task._id)}
                      title="Mark as Completed"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                      Done
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}