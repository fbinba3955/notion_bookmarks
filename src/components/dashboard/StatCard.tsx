'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  trendUp?: boolean;
  icon?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendUp = true,
  icon = 'LineChart',
  className,
}) => {
  const IconComponent = icon ? (Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>) : null;

  return (
    <div className={cn(
      "rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full p-2 bg-primary/10">
          {IconComponent && <IconComponent className="h-4 w-4 text-primary" />}
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</div>
        
        {trend !== undefined && (
          <div className="flex items-center mt-1">
            {trendUp ? (
              <Icons.TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <Icons.TrendingDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <p className={cn(
              "text-sm",
              trendUp ? "text-green-500" : "text-red-500"
            )}>
              {trend}%
            </p>
            <p className="text-xs text-muted-foreground ml-1">与上月相比</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard; 