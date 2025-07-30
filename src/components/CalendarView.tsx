import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckSquare,
  Link2,
  FileText,
  Lock,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface DayData {
  date: Date;
  tasksCompleted: number;
  itemsSaved: number;
  totalActivity: number;
}

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<Map<string, DayData>>(new Map());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    generateCalendarData();
  }, [selectedMonth]);

  const generateCalendarData = () => {
    const data = new Map<string, DayData>();
    
    // Get stored data
    const tasks = JSON.parse(localStorage.getItem('app-vault-tasks') || '[]');
    const links = JSON.parse(localStorage.getItem('app-vault-links') || '[]');
    const pdfs = JSON.parse(localStorage.getItem('app-vault-pdfs') || '[]');
    const passwords = JSON.parse(localStorage.getItem('app-vault-passwords') || '[]');

    // Generate data for the current month and previous months
    const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 2, 1);
    const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 2, 0);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toDateString();
      
      // Count completed tasks for this day
      const dayTasks = tasks.filter((task: any) => {
        if (!task.completedAt) return false;
        return new Date(task.completedAt).toDateString() === dateStr;
      });

      // Count items saved on this day
      const dayLinks = links.filter((link: any) => 
        new Date(link.createdAt).toDateString() === dateStr
      );
      const dayPdfs = pdfs.filter((pdf: any) => 
        new Date(pdf.createdAt || pdf.uploadedAt).toDateString() === dateStr
      );
      const dayPasswords = passwords.filter((pwd: any) => 
        new Date(pwd.createdAt).toDateString() === dateStr
      );

      const itemsSaved = dayLinks.length + dayPdfs.length + dayPasswords.length;
      const tasksCompleted = dayTasks.length;
      
      data.set(dateStr, {
        date: new Date(d),
        tasksCompleted,
        itemsSaved,
        totalActivity: tasksCompleted + itemsSaved
      });
    }

    setCalendarData(data);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getActivityLevel = (activity: number) => {
    if (activity === 0) return 'bg-muted/20';
    if (activity <= 2) return 'bg-primary/30';
    if (activity <= 5) return 'bg-primary/60';
    return 'bg-primary/90';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(selectedMonth);
  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate monthly stats
  const monthlyStats = Array.from(calendarData.values()).reduce((acc, day) => {
    if (day.date.getMonth() === selectedMonth.getMonth() && 
        day.date.getFullYear() === selectedMonth.getFullYear()) {
      acc.totalTasks += day.tasksCompleted;
      acc.totalItems += day.itemsSaved;
      if (day.totalActivity > 0) acc.activeDays++;
    }
    return acc;
  }, { totalTasks: 0, totalItems: 0, activeDays: 0 });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Activity Calendar
          </h2>
          <p className="text-muted-foreground">Track your daily productivity and progress</p>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold text-green-400">{monthlyStats.totalTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Items Saved</p>
                <p className="text-2xl font-bold text-blue-400">{monthlyStats.totalItems}</p>
              </div>
              <Plus className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Days</p>
                <p className="text-2xl font-bold text-primary">{monthlyStats.activeDays}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>{monthName}</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
                className="btn-glass"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedMonth(new Date())}
                className="btn-glass"
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('next')}
                className="btn-glass"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <TooltipProvider>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square" />;
                }
                
                const dayData = calendarData.get(day.toDateString()) || {
                  date: day,
                  tasksCompleted: 0,
                  itemsSaved: 0,
                  totalActivity: 0
                };
                
                const isToday = day.toDateString() === new Date().toDateString();
                const activityLevel = getActivityLevel(dayData.totalActivity);
                
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div 
                        className={`
                          aspect-square p-2 rounded-lg border border-border/30 
                          cursor-pointer hover-scale transition-all duration-300
                          ${activityLevel}
                          ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                        `}
                      >
                        <div className="flex flex-col h-full">
                          <span className="text-sm font-medium text-foreground">
                            {day.getDate()}
                          </span>
                          
                          {dayData.totalActivity > 0 && (
                            <div className="flex-1 flex items-end justify-center">
                              <div className="flex space-x-1">
                                {dayData.tasksCompleted > 0 && (
                                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                                )}
                                {dayData.itemsSaved > 0 && (
                                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold">
                          {day.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        
                        {dayData.totalActivity > 0 ? (
                          <div className="space-y-1">
                            {dayData.tasksCompleted > 0 && (
                              <div className="flex items-center space-x-2">
                                <CheckSquare className="h-4 w-4 text-green-400" />
                                <span className="text-sm">
                                  {dayData.tasksCompleted} task{dayData.tasksCompleted !== 1 ? 's' : ''} completed
                                </span>
                              </div>
                            )}
                            
                            {dayData.itemsSaved > 0 && (
                              <div className="flex items-center space-x-2">
                                <Plus className="h-4 w-4 text-blue-400" />
                                <span className="text-sm">
                                  {dayData.itemsSaved} item{dayData.itemsSaved !== 1 ? 's' : ''} saved
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No activity</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Activity Legend */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">Activity Legend</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted/20 rounded border border-border/30" />
                  <span className="text-sm text-muted-foreground">No activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary/30 rounded" />
                  <span className="text-sm text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary/60 rounded" />
                  <span className="text-sm text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary/90 rounded" />
                  <span className="text-sm text-muted-foreground">High</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm text-muted-foreground">Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm text-muted-foreground">Items Saved</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};