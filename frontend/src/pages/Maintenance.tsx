import { useEffect, useState } from 'react';
import { Wrench, Calendar, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScheduleMaintenanceDialog } from '@/components/ScheduleMaintenanceDialog';
import { useAuth } from '@/context/AuthContext';

// Define Interface Locally
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://assetmanagement-8r1x.onrender.com/api';

export default function Maintenance() {
  const [tasks, setTasks] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token, user } = useAuth(); // Get User Role

  const fetchMaintenance = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance records', error);
      toast({ title: 'Error', description: 'Failed to load records', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [token]);

  // Handler to mark task as completed (Admin Only)
  const handleCompleteTask = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });
      
      if(res.ok) {
        toast({ title: 'Success', description: 'Maintenance marked as completed' });
        fetchMaintenance(); 
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Only Admins can complete tasks', variant: 'destructive' });
    }
  };

  const stats = {
    open: tasks.filter(t => t.status === 'scheduled').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-orange-500 text-white',
    low: 'bg-slate-500 text-white',
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isAdmin ? 'Maintenance Queue' : 'My Reported Issues'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage repair tickets and assign technicians' : 'Track the repair status of your assets'}
          </p>
        </div>
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
           <div className="text-center py-10 text-muted-foreground">
             {isAdmin ? "No maintenance tickets found." : "You haven't reported any issues yet."}
           </div>
        ) : (
          tasks.map((task) => (
            <Card key={task._id} className="p-6 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{task.asset?.name || 'Unknown Asset'}</h3>
                    <Badge variant="outline">{task.asset?.assetID}</Badge>
                    <Badge className={priorityColors[task.priority] || 'bg-slate-500'}>
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
                  
                  {/* Only Admin can mark as Done */}
                  {isAdmin && task.status !== 'completed' && (
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