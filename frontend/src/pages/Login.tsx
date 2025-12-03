import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext'; // Using relative path
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password); 

      if (success) {
        toast({
          title: 'Welcome to Fluid Controls',
          description: 'Login successful',
        });
        
        // --- REDIRECT LOGIC ---
        // We check localStorage because state updates might not be instant
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // If Admin -> Dashboard
          // If Employee -> Assets
          if (userData.role === 'ADMIN') {
            navigate('/dashboard');
          } else {
            navigate('/assets'); 
          }
        } else {
          // Fallback
          navigate('/assets');
        }
        
      } else {
         toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please check credentials and server connection.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
       toast({
        title: 'Login Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogin = (role: 'admin' | 'employee') => {
    const emails = {
      admin: 'admin@fluidcontrols.com',
      employee: 'employee@fluidcontrols.com',
    };
    setEmail(emails[role]);
    setPassword('demo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNi AyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <Card className="w-full max-w-md p-8 backdrop-blur-sm bg-card/95 shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-primary items-center justify-center mb-4 shadow-glow">
            <span className="text-primary-foreground font-bold text-2xl">FC</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Fluid Controls</h1>
          <p className="text-muted-foreground">IT Asset Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@fluidcontrols.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Quick Demo Login</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => quickLogin('admin')} disabled={isSubmitting}>
              Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('employee')} disabled={isSubmitting}>
              Employee
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}