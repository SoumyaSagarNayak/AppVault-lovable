import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Link2, 
  FileText, 
  Lock, 
  CheckSquare, 
  Quote,
  Target,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeTab, setActiveTab }) => {
  const [dailyQuote, setDailyQuote] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const [todayGoal, setTodayGoal] = useState(5);
  const [completed, setCompleted] = useState(0);

  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't let yesterday take up too much of today. - Will Rogers",
    "You learn more from failure than from success. Don't let it stop you. - Unknown",
    "If you are working on something exciting that you really care about, you don't have to be pushed. - Steve Jobs"
  ];

  useEffect(() => {
    // Set daily quote based on date
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('app-vault-quote-date');
    
    if (storedDate !== today) {
      const quoteIndex = new Date().getDate() % quotes.length;
      const quote = quotes[quoteIndex];
      setDailyQuote(quote);
      localStorage.setItem('app-vault-quote-date', today);
      localStorage.setItem('app-vault-daily-quote', quote);
    } else {
      const stored = localStorage.getItem('app-vault-daily-quote');
      setDailyQuote(stored || quotes[0]);
    }

    // Load streak and stats
    const streak = localStorage.getItem('app-vault-streak');
    setStreakCount(parseInt(streak || '0'));

    // Calculate today's completion
    const tasks = JSON.parse(localStorage.getItem('app-vault-tasks') || '[]');
    const todayTasks = tasks.filter((task: any) => {
      const taskDate = new Date(task.createdAt || Date.now()).toDateString();
      return taskDate === today && task.completed;
    });
    setCompleted(todayTasks.length);
  }, []);

  const stats = [
    {
      title: 'Links Saved',
      count: JSON.parse(localStorage.getItem('app-vault-links') || '[]').length,
      icon: Link2,
      color: 'text-blue-400',
      tab: 'links'
    },
    {
      title: 'PDFs Stored',
      count: JSON.parse(localStorage.getItem('app-vault-pdfs') || '[]').length,
      icon: FileText,
      color: 'text-green-400',
      tab: 'pdfs'
    },
    {
      title: 'Passwords',
      count: JSON.parse(localStorage.getItem('app-vault-passwords') || '[]').length,
      icon: Lock,
      color: 'text-red-400',
      tab: 'passwords'
    },
    {
      title: 'Tasks',
      count: JSON.parse(localStorage.getItem('app-vault-tasks') || '[]').length,
      icon: CheckSquare,
      color: 'text-purple-400',
      tab: 'tasks'
    }
  ];

  const progressPercentage = todayGoal > 0 ? (completed / todayGoal) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow">
          Welcome to App Vault
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your personal productivity vault for links, documents, passwords, and tasks. 
          Everything organized in one beautiful place.
        </p>
      </div>

      {/* Daily Quote */}
      <Card className="gradient-card border-border/50 hover-glow">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-full gradient-primary">
              <Quote className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-2">Daily Motivation</h3>
              <blockquote className="text-foreground italic text-lg leading-relaxed">
                "{dailyQuote}"
              </blockquote>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.tab} 
            className="gradient-card border-border/50 hover-scale hover-glow cursor-pointer transition-all duration-300"
            onClick={() => setActiveTab(stat.tab)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Progress */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Today's Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tasks Completed</span>
              <Badge variant="secondary">{completed}/{todayGoal}</Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {progressPercentage >= 100 ? "Great job! Goal achieved!" : `${Math.round(progressPercentage)}% complete`}
            </p>
          </CardContent>
        </Card>

        {/* Streak Counter */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-warning" />
              <span>Productivity Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-warning animate-glow">
                {streakCount}
              </div>
              <p className="text-sm text-muted-foreground">
                {streakCount === 1 ? 'day' : 'days'} streak
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              {[...Array(Math.min(5, streakCount))].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
              {streakCount > 5 && (
                <span className="text-warning font-bold">+{streakCount - 5}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Quick Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <button
                key={stat.tab}
                onClick={() => setActiveTab(stat.tab)}
                className="p-4 rounded-lg gradient-glow border border-border/50 hover-scale transition-all duration-300 group"
              >
                <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-medium">{stat.title}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};