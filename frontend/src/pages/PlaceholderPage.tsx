
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = "This module is coming soon.",
  icon 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Manage {title.toLowerCase()} for your business
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            {icon || <CalendarClock className="h-6 w-6" />}
          </div>
          <CardTitle className="text-xl">Coming Soon</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're working hard to bring you this feature. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
