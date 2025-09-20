import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Mic, 
  TrendingUp, 
  User,
  Upload,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'scripts', label: 'Scripts', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Mic },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="bg-background border-t border-border">
      <div className="container max-w-md mx-auto">
        <nav className="flex justify-around py-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-3 px-2 text-xs font-medium transition-colors",
                activeTab === id 
                  ? "text-primary bg-primary/5" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onTabChange(id)}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;