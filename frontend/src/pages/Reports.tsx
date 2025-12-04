import { useState, useEffect, useMemo } from 'react';
import { Download, FileText, TrendingUp, Loader2, PieChart as PieIcon, BarChart3, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://assetmanagement-8r1x.onrender.com/api';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

export default function Reports() {
  const { toast } = useToast();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Could not load report data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, toast]);

  // --- Process Data for Charts ---
  const chartsData = useMemo(() => {
    if (!reportData?.rawAssets) return { statusData: [], valueData: [] };

    // 1. Status Breakdown (Pie Chart) - Keeps track of availability
    const statusCounts: Record<string, number> = {};
    reportData.rawAssets.forEach((a: any) => {
      const status = a.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const statusData = Object.keys(statusCounts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusCounts[key]
    }));

    // 2. Financial Value by Category (Bar Chart) - NEW LOGIC
    // Instead of counting items, we sum their COST.
    const categoryValue: Record<string, number> = {};
    
    reportData.rawAssets.forEach((a: any) => {
      const cat = a.category || 'Uncategorized';
      const cost = Number(a.cost) || 0; // Ensure it's a number
      categoryValue[cat] = (categoryValue[cat] || 0) + cost;
    });
    
    // Convert to array, sort by Value (High to Low), take Top 6
    const valueData = Object.keys(categoryValue).map(key => ({
      name: key,
      value: categoryValue[key]
    })).sort((a, b) => b.value - a.value).slice(0, 6);

    return { statusData, valueData };
  }, [reportData]);

  // --- CSV Export ---
  const handleExport = (type: 'assets' | 'maintenance') => {
    if (!reportData) return;
    const items = type === 'assets' ? reportData.rawAssets : reportData.rawMaintenance;
    if (!items?.length) return toast({ title: 'No Data', description: 'Nothing to export.' });

    const headers = Object.keys(items[0]).join(',');
    const rows = items.map((obj: any) => Object.values(obj).map(v => `"${v}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fluid_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Tooltip for Currency
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border p-2 rounded-lg shadow-sm">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Financial and operational insights.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => handleExport('assets')} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" /> Assets CSV
          </Button>
          <Button className="bg-gradient-primary flex-1 sm:flex-none" onClick={() => handleExport('maintenance')}>
            <FileText className="h-4 w-4 mr-2" /> Maintenance CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Assets</p>
            <p className="text-2xl font-bold">{reportData?.stats?.totalAssets || 0}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Valuation</p>
            <p className="text-2xl font-bold">₹{(reportData?.stats?.totalValue || 0).toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Repairs</p>
            <p className="text-2xl font-bold">{reportData?.stats?.maintenanceCount || 0}</p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Status Distribution (Operational View) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-primary" />
              Asset Availability
            </CardTitle>
            <CardDescription>Ratio of Available vs In-Use assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartsData.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartsData.statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Financial Value (Business View) - REPLACED */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Financial Value by Category
            </CardTitle>
            <CardDescription>Total investment (cost) per asset type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData.valueData} margin={{ bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    interval={0} 
                    angle={-15} 
                    textAnchor="end"
                  />
                  <YAxis 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value/1000}k`} // Abbreviate large numbers
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}