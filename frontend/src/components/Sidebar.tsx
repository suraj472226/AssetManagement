// frontend/src/components/Sidebar.tsx
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  X,
  LogOut 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; // <--- Import Auth Hook

// Define items with allowed roles
const navItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    roles: ['ADMIN', 'EMPLOYEE'] 
  },
  { 
    name: 'Assets', 
    path: '/assets', 
    icon: Package, 
    roles: ['ADMIN', 'EMPLOYEE'] 
  },
  { 
    name: 'Requests', 
    path: '/requests', 
    icon: FileText, 
    roles: ['ADMIN', 'EMPLOYEE'] 
  },
  { 
    name: 'Maintenance', 
    path: '/maintenance', 
    icon: Wrench, 
    roles: ['ADMIN', 'EMPLOYEE'] 
  },
  { 
    name: 'Audit', 
    path: '/audit', 
    icon: ClipboardCheck, 
    roles: ['ADMIN'] // Admin Only
  },
  { 
    name: 'Reports', 
    path: '/reports', 
    icon: BarChart3, 
    roles: ['ADMIN'] // Admin Only
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user, logout } = useAuth(); // <--- Get current user and logout function

  // Filter items based on user role
  const visibleNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r bg-card flex flex-col transition-transform duration-300 ease-in-out z-50",
        "md:sticky md:top-0 md:h-screen md:translate-x-0",
        "fixed top-0 left-0 h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FC</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Fluid Controls</h1>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'ADMIN' ? 'Admin Workspace' : 'Employee Portal'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {visibleNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t space-y-2">
          {/* Settings - Only for Admin */}
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )
              }
            >
              <Settings className="h-5 w-5" />
              Settings
            </NavLink>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}