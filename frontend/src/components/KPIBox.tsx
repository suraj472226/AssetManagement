import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPIBoxProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function KPIBox({ title, value, subtitle, icon: Icon, trend, className }: KPIBoxProps) {
  return (
    <Card className={cn('p-6 hover:shadow-lg transition-all animate-fade-in', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <div className={cn('text-sm font-medium', trend.isPositive ? 'text-success' : 'text-destructive')}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold animate-count-up">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </Card>
  );
}
