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
import { Loader2, Plus, Sparkles } from 'lucide-react'; // Make sure to import Sparkles

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
  onSuccess: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://assetmanagement-8r1x.onrender.com/api';

export function ScheduleMaintenanceDialog({ onSuccess }: ScheduleMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // State for AI loading
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
          const res = await fetch(`${API_BASE_URL}/assets`, {
            headers: { Authorization: `Bearer ${token}` },
          });

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

  // --- AI ANALYSIS FUNCTION ---
  const handleAIAnalyze = async () => {
    const description = form.getValues('description');
    if (!description || description.length < 5) {
      toast({ title: 'AI Info', description: 'Please describe the issue first.', variant: 'default' });
      return;
    }

    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description })
      });

      if (!res.ok) throw new Error('AI Analysis failed');

      const data = await res.json();
      
      // Auto-fill form based on AI result
      form.setValue('priority', data.priority);
      
      toast({ 
        title: '✨ AI Analysis Complete', 
        description: `Priority set to ${data.priority.toUpperCase()}. Suggestion: ${data.suggestion}`,
        className: "bg-purple-50 border-purple-200 text-purple-900"
      });

    } catch (error) {
      toast({ title: 'AI Error', description: 'Could not analyze issue.', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };
  // ---------------------------

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/maintenance`, {
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
      onSuccess();
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
            Create a new maintenance ticket. Use AI to auto-assess priority.
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the issue in detail..." {...field} />
                  </FormControl>
                  
                  {/* AI Button */}
                  <div className="mt-2 flex justify-end">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleAIAnalyze}
                      disabled={isAnalyzing}
                      className="text-xs gap-2 text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200"
                    >
                      {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      {isAnalyzing ? "Analyzing..." : "Auto-Detect Priority with AI"}
                    </Button>
                  </div>
                  
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
                    <Select onValueChange={field.onChange} value={field.value}>
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