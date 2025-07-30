import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { LinksManager } from '@/components/LinksManager';
import { PDFsManager } from '@/components/PDFsManager';
import { PasswordsManager } from '@/components/PasswordsManager';
import { TasksManager } from '@/components/TasksManager';
import { CalendarView } from '@/components/CalendarView';
import { CreatorSection } from '@/components/CreatorSection';
import { ProfileDialog } from '@/components/ProfileDialog';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Set dark theme by default
    document.documentElement.classList.add('dark');
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'links':
        return <LinksManager />;
      case 'pdfs':
        return <PDFsManager />;
      case 'passwords':
        return <PasswordsManager />;
      case 'tasks':
        return <TasksManager />;
      case 'calendar':
        return <CalendarView />;
      case 'profile':
        setIsProfileOpen(true);
        setActiveTab('dashboard');
        return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'creator':
        return <CreatorSection />;
      default:
        return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {renderActiveComponent()}
      </main>
      
      <ProfileDialog 
        open={isProfileOpen} 
        onOpenChange={setIsProfileOpen} 
      />
    </div>
  );
};

export default Index;
