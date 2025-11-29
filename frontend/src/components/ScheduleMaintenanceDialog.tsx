import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

const formSchema = z.object({
  assetId: z.string().min(1, 'Please select an asset'),
  issue: z.string().min(3, 'Issue title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  assignedTo: z.string().optional(),
});

interface Asset {
  _id: string;
  name: string;
  assetID: string;
}

interface ScheduleMaintenanceDialogProps {
  onSuccess: () => void; // Callback to refresh the list after adding
}

export function ScheduleMaintenanceDialog({ onSuccess }: ScheduleMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issue: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
    },
  });

  // Fetch assets when dialog opens
  useEffect(() => {
    if (open) {
      const fetchAssets = async () => {
        setIsLoadingAssets(true);
        try {
          const token = localStorage.getItem('token');
          const baseUrl = import.meta.env.VITE_API_BASE_URL;
          
          if (!baseUrl) {
            console.error("VITE_API_BASE_URL is not defined in .env");
            return;
          }

          const res = await fetch(`${baseUrl}/assets`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Check if response is valid JSON
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await res.json();
            setAssets(data);
          } else {
            console.error("Received non-JSON response from server");
            toast({ 
              title: "Connection Error", 
              description: "Could not connect to the backend API.", 
              variant: "destructive" 
            });
          }
        } catch (error) {
          console.error('Failed to fetch assets', error);
        } finally {
          setIsLoadingAssets(false);
        }
      };
      fetchAssets();
    }
  }, [open, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to schedule maintenance');

      toast({ title: 'Success', description: 'Maintenance scheduled successfully' });
      setOpen(false);
      form.reset();
      onSuccess(); // Refresh the parent list
    } catch (error) {
      toast({ title: 'Error', description: 'Could not schedule maintenance', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary w-full sm:w-auto gap-2">
          <Plus className="h-4 w-4" /> Schedule Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Maintenance</DialogTitle>
          <DialogDescription>
            Create a new maintenance ticket for an asset. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingAssets}>
                        <SelectValue placeholder={isLoadingAssets ? "Loading assets..." : "Select an asset"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets.length > 0 ? (
                        assets.map((asset) => (
                          <SelectItem key={asset._id} value={asset._id}>
                            {asset.assetID} - {asset.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {isLoadingAssets ? "Loading..." : "No assets found"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Broken Screen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., IT Support" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description of the issue..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Ticket
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}