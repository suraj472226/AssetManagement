// fluid-asset-flow/src/data/mockData.ts
// Mock data for Fluid Controls ITAM

export interface Asset {
  _id: string;
  id: number;
  assetID: string;
  name: string;
  status: 'in-use' | 'available' | 'maintenance' | 'retired';
  category: 'Laptop' | 'Desktop' | 'Monitor' | 'Phone' | 'Server' | 'Other';
  department: string;
  purchaseDate?: string;
  warrantyEnd: string;
  cost?: number;
  currentOwner?: string;
  location: string;
}

export interface Request {
  id: number;
  requestID: string;
  employeeName: string;
  assetType: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  reason: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'auditor';
}

export const mockAssets: Asset[] = [
  {
    _id: 'mock_id_1',
    id: 1,
    assetID: 'FLUID-IT-001',
    name: 'Dell Latitude 5430',
    status: 'in-use',
    category: 'Laptop',
    department: 'Engineering',
    purchaseDate: '2023-04-12',
    warrantyEnd: '2025-04-12',
    cost: 85000,
    currentOwner: 'Amit Sharma',
    location: 'Bangalore Office - 3rd Floor',
  },
  {
    _id: 'mock_id_2',
    id: 2,
    assetID: 'FLUID-IT-002',
    name: 'HP ProBook 450',
    status: 'available',
    category: 'Laptop',
    department: 'IT',
    purchaseDate: '2023-06-20',
    warrantyEnd: '2025-06-20',
    cost: 72000,
    location: 'IT Storage Room',
  },
  {
    _id: 'mock_id_3', 
    id: 3,
    assetID: 'FLUID-IT-003',
    name: 'Dell UltraSharp U2723DE',
    status: 'in-use',
    category: 'Monitor',
    department: 'Design',
    purchaseDate: '2023-08-15',
    warrantyEnd: '2026-08-15',
    cost: 42000,
    currentOwner: 'Priya Patel',
    location: 'Bangalore Office - 2nd Floor',
  },
  {
    _id: 'mock_id_4',
    id: 4,
    assetID: 'FLUID-IT-004',
    name: 'iPhone 14 Pro',
    status: 'in-use',
    category: 'Phone',
    department: 'Sales',
    purchaseDate: '2023-10-01',
    warrantyEnd: '2024-10-01',
    cost: 129900,
    currentOwner: 'Rahul Verma',
    location: 'Sales Team',
  },
  {
    _id: 'mock_id_5',
    id: 5,
    assetID: 'FLUID-IT-005',
    name: 'Lenovo ThinkPad X1',
    status: 'maintenance',
    category: 'Laptop',
    department: 'Finance',
    purchaseDate: '2022-12-10',
    warrantyEnd: '2024-12-10',
    cost: 95000,
    currentOwner: 'Sneha Reddy',
    location: 'Maintenance Center',
  },
  {
    _id: 'mock_id_6',
    id: 6,
    assetID: 'FLUID-IT-006',
    name: 'Mac Mini M2',
    status: 'in-use',
    category: 'Desktop',
    department: 'Marketing',
    purchaseDate: '2023-11-05',
    warrantyEnd: '2025-11-05',
    cost: 65000,
    currentOwner: 'Karan Singh',
    location: 'Bangalore Office - 4th Floor',
  },
  {
    _id: 'mock_id_7',
    id: 7,
    assetID: 'FLUID-IT-007',
    name: 'Dell OptiPlex 7090',
    status: 'available',
    category: 'Desktop',
    department: 'IT',
    purchaseDate: '2023-03-22',
    warrantyEnd: '2026-03-22',
    cost: 58000,
    location: 'IT Storage Room',
  },
  {
    _id: 'mock_id_8', 
    id: 8,
    assetID: 'FLUID-IT-008',
    name: 'Samsung Galaxy S23',
    status: 'in-use',
    category: 'Phone',
    department: 'Operations',
    purchaseDate: '2023-09-12',
    warrantyEnd: '2025-09-12',
    cost: 89999,
    currentOwner: 'Anjali Desai',
    location: 'Operations Team',
  },
  {
    _id: 'mock_id_9',
    id: 9,
    assetID: 'FLUID-IT-009',
    name: 'HP Z2 Workstation',
    status: 'in-use',
    category: 'Desktop',
    department: 'Engineering',
    purchaseDate: '2023-07-18',
    warrantyEnd: '2026-07-18',
    cost: 145000,
    currentOwner: 'Vikram Malhotra',
    location: 'Bangalore Office - 3rd Floor',
  },
  {
    _id: 'mock_id_10',
    id: 10,
    assetID: 'FLUID-IT-010',
    name: 'LG 27UK850',
    status: 'retired',
    category: 'Monitor',
    department: 'Finance',
    purchaseDate: '2020-05-10',
    warrantyEnd: '2023-05-10',
    cost: 38000,
    location: 'Storage - Retired',
  },
];

export const mockRequests: Request[] = [
  {
    id: 1,
    requestID: 'REQ-001',
    employeeName: 'Neha Gupta',
    assetType: 'Laptop',
    department: 'HR',
    status: 'pending',
    requestDate: '2024-01-15',
    reason: 'New joiner - requires laptop for onboarding',
  },
  {
    id: 2,
    requestID: 'REQ-002',
    employeeName: 'Arjun Khanna',
    assetType: 'Monitor',
    department: 'Engineering',
    status: 'approved',
    requestDate: '2024-01-12',
    reason: 'Dual monitor setup for increased productivity',
  },
  {
    id: 3,
    requestID: 'REQ-003',
    employeeName: 'Meera Iyer',
    assetType: 'Phone',
    department: 'Sales',
    status: 'pending',
    requestDate: '2024-01-18',
    reason: 'Field work requires mobile device',
  },
  {
    id: 4,
    requestID: 'REQ-004',
    employeeName: 'Rohit Sharma',
    assetType: 'Desktop',
    department: 'Finance',
    status: 'rejected',
    requestDate: '2024-01-10',
    reason: 'Budget constraints for this quarter',
  },
];

export const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@fluidcontrols.com', role: 'admin' },
  { id: 2, name: 'IT Manager', email: 'manager@fluidcontrols.com', role: 'manager' },
  { id: 3, name: 'Regular Employee', email: 'employee@fluidcontrols.com', role: 'employee' },
  { id: 4, name: 'Auditor', email: 'auditor@fluidcontrols.com', role: 'auditor' },
];

export const mockKPIs = {
  totalAssets: 247,
  utilizationRate: 87.5,
  upcomingExpiries: 8,
  costSavings: 12.3,
  assetsByDepartment: [
    { name: 'Engineering', count: 68 },
    { name: 'IT', count: 45 },
    { name: 'Sales', count: 32 },
    { name: 'Finance', count: 28 },
    { name: 'HR', count: 18 },
    { name: 'Marketing', count: 24 },
    { name: 'Operations', count: 32 },
  ],
  assetsByStatus: [
    { name: 'In Use', value: 185, fill: 'hsl(var(--primary))' },
    { name: 'Available', value: 42, fill: 'hsl(var(--success))' },
    { name: 'Maintenance', value: 12, fill: 'hsl(var(--warning))' },
    { name: 'Retired', value: 8, fill: 'hsl(var(--muted))' },
  ],
  monthlyTrend: [
    { month: 'Jul', value: 235 },
    { month: 'Aug', value: 238 },
    { month: 'Sep', value: 242 },
    { month: 'Oct', value: 245 },
    { month: 'Nov', value: 246 },
    { month: 'Dec', value: 247 },
  ],
};
