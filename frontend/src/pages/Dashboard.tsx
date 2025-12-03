import { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertCircle, ServerCrash, Loader2, LineChart as LineChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import KPIBox from '@/components/KPIBox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { mockKPIs } from '@/data/mockData'; // Kept for the static "Asset Growth Trend" chart

const API_BASE_URL = 'https://assetmanagement-8r1x.onrender.com/api';

// Define the shape of the data we expect from the backend
// NOTE: We've replaced assetsByDepartment with assetsByCategory
interface DashboardData {
  totalAssets: number;
  utilizationRate: number;
  upcomingExpiries: number;
  totalValue: number;
  assetsByStatus: { name: string; value: number }[];
  assetsByCategory: { name: string; count: number }[];
}

// Define colors for the pie chart to match your theme
const STATUS_COLORS: { [key: string]: string } = {
  'in-use': 'hsl(var(--primary))',
  'available': 'hsl(var(--success))',
  'maintenance': 'hsl(var(--warning))',
  'retired': 'hsl(var(--muted-foreground))',
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/reports/dashboard-summary`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to load dashboard data. Please try again.');
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  // --- ADDED THIS FUNCTION ---
  // A custom function to render pretty labels on the pie chart
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3; // Position label outside the slice
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs fill-muted-foreground">
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };
  // --- END ADDED FUNCTION ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg font-medium text-muted-foreground">Loading Dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-destructive-foreground bg-destructive/90 rounded-lg">
        <ServerCrash className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Could Not Load Dashboard</h3>
        <p>{error || 'An unknown error occurred.'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your IT asset inventory</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPIBox title="Total Assets" value={data.totalAssets} icon={Package} />
        <KPIBox title="Utilization Rate" value={`${data.utilizationRate}%`} icon={TrendingUp} />
        <KPIBox title="Upcoming Expiries" value={data.upcomingExpiries} icon={AlertCircle} />
        <KPIBox title="Total Asset Value" value={`₹${(data.totalValue / 100000).toFixed(2)}L`} icon={LineChartIcon} subtitle="Based on purchase cost" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader><CardTitle>Assets by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.assetsByCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }} 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem' 
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* --- MODIFIED THIS CARD --- */}
        <Card>
          <CardHeader><CardTitle>Assets by Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={data.assetsByStatus} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} // We don't need the line, our custom label is enough
                  label={renderCustomizedLabel} // Use our new custom label renderer
                  outerRadius={90} // Made the pie slightly smaller to give labels space
                  dataKey="value" 
                  nameKey="name"
                >
                  {data.assetsByStatus.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#cccccc'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* --- END MODIFICATION --- */}

        {/* Note: The trend chart still uses mock data as historical data is not available from the Asset model alone. */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Asset Growth Trend (Sample)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockKPIs.monthlyTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem' 
                  }} 
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}