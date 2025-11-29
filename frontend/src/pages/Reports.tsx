import { Download, FileText, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const mttrData = [
  { month: 'Jul', days: 3.2 },
  { month: 'Aug', days: 2.8 },
  { month: 'Sep', days: 2.5 },
  { month: 'Oct', days: 2.1 },
  { month: 'Nov', days: 1.9 },
  { month: 'Dec', days: 1.7 },
];

export default function Reports() {
  const { toast } = useToast();

  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: 'Your report will be downloaded shortly.',
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and data exports</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => handleExport('csv')} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button className="bg-gradient-primary flex-1 sm:flex-none" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">1.7 days</p>
              <p className="text-sm text-muted-foreground">Avg. MTTR</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹42.5L</p>
              <p className="text-sm text-muted-foreground">Total Asset Value</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">94.2%</p>
              <p className="text-sm text-muted-foreground">Asset Availability</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Mean Time to Repair (MTTR) Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <LineChart data={mttrData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="days"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            ↓ 46.9% improvement in repair time over 6 months
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">Quick Reports</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Asset Depreciation Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Warranty Expiration Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Department-wise Allocation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Maintenance Cost Analysis
            </Button>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">Scheduled Reports</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Monthly Asset Summary</p>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Every 1st of the month</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Weekly Maintenance Report</p>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
            </div>
            <Button variant="outline" className="w-full">
              Create New Schedule
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
