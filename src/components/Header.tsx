import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import { ProfileDialog } from './ProfileDialog';
import { Vault, User } from 'lucide-react';

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userCount, setUserCount] = useState(() => {
    const stored = localStorage.getItem('app-vault-user-count');
    return stored ? parseInt(stored) : 50;
  });

  React.useEffect(() => {
    // Increment user count on first visit
    const hasVisited = localStorage.getItem('app-vault-visited');
    if (!hasVisited) {
      const newCount = userCount + 1;
      setUserCount(newCount);
      localStorage.setItem('app-vault-user-count', newCount.toString());
      localStorage.setItem('app-vault-visited', 'true');
    }
  }, []);

  const profile = JSON.parse(localStorage.getItem('app-vault-profile') || '{}');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg gradient-primary">
              <Vault className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                App Vault
              </h1>
              <p className="text-xs text-muted-foreground">Personal Productivity</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-card border border-border/50">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{userCount.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">users</span>
          </div>
          
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover-glow"
            onClick={() => setIsProfileOpen(true)}
          >
            <Avatar className="h-8 w-8 border-2 border-primary/20">
              <AvatarImage src={profile.avatar} alt={profile.name || 'User'} />
              <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      <ProfileDialog 
        open={isProfileOpen} 
        onOpenChange={setIsProfileOpen} 
      />
    </header>
  );
};