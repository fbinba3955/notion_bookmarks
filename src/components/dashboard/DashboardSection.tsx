'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  icon,
  children,
  className,
}) => {
  const IconComponent = icon ? (Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>) : null;

  return (
    <div className={cn(
      "rounded-lg border bg-card shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center">
          {IconComponent && (
            <div className="mr-3 rounded-md bg-primary/10 p-2">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
          )}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          查看全部
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardSection; 