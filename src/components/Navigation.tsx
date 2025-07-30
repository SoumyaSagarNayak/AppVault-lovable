import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Link2, 
  FileText, 
  Lock, 
  CheckSquare, 
  Calendar,
  User,
  Code
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'pdfs', label: 'PDFs', icon: FileText },
    { id: 'passwords', label: 'Passwords', icon: Lock },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'creator', label: 'Creator', icon: Code }
  ];

  return (
    <nav className="w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-center space-x-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-2 transition-all duration-300 ${
              activeTab === item.id 
                ? 'btn-gradient hover-glow' 
                : 'hover:bg-gradient-glow btn-glass'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex overflow-x-auto scrollbar-hide p-4 space-x-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-300 ${
              activeTab === item.id 
                ? 'btn-gradient hover-glow' 
                : 'hover:bg-gradient-glow btn-glass'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};