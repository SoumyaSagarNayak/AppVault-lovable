import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Calendar,
  CheckSquare,
  Clock,
  AlertTriangle,
  Star,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export const TasksManager = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('app-vault-tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('app-vault-tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Task title is required.",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pending',
      dueDate: newTask.dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    saveTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setIsAddOpen(false);
    
    toast({
      title: "Task Added",
      description: `${task.title} has been added to your task list.`
    });
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const isCompleting = !task.completed;
        const updated = {
          ...task,
          completed: isCompleting,
          status: isCompleting ? 'completed' as const : 'pending' as const,
          completedAt: isCompleting ? new Date().toISOString() : undefined
        };

        if (isCompleting) {
          // Update streak
          const today = new Date().toDateString();
          const completedToday = updatedTasks.filter(t => 
            t.completed && 
            new Date(t.completedAt || '').toDateString() === today
          ).length;

          if (completedToday === 0) { // First task completed today
            const currentStreak = parseInt(localStorage.getItem('app-vault-streak') || '0');
            localStorage.setItem('app-vault-streak', (currentStreak + 1).toString());
          }

          toast({
            title: "Task Completed! 🎉",
            description: `Great job completing "${task.title}"!`
          });
        }

        return updated;
      }
      return task;
    });

    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
    
    toast({
      title: "Task Deleted",
      description: "The task has been removed from your list."
    });
  };

  const updateTask = () => {
    if (!editingTask || !editingTask.title) return;

    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    );
    
    saveTasks(updatedTasks);
    setEditingTask(null);
    
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully."
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckSquare;
      default: return CheckSquare;
    }
  };

  const isOverdue = (dueDate: string) => {
    return dueDate && new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.completed;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => isOverdue(t.dueDate)).length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Task Manager
          </h2>
          <p className="text-muted-foreground">Stay organized and productive</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="gradient-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-primary">Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task description (optional)"
                  className="bg-background/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <Button onClick={addTask} className="w-full btn-gradient">
                <Target className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const PriorityIcon = getPriorityIcon(task.priority);
          const overdue = isOverdue(task.dueDate);
          
          return (
            <Card 
              key={task.id} 
              className={`gradient-card border-border/50 hover-scale transition-all duration-300 ${
                task.completed ? 'opacity-70' : ''
              } ${overdue ? 'border-red-400/50' : ''}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold ${
                          task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge className={getPriorityColor(task.priority)}>
                            <PriorityIcon className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                          
                          {task.dueDate && (
                            <div className={`flex items-center text-sm ${
                              overdue ? 'text-red-400' : 'text-muted-foreground'
                            }`}>
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                              {overdue && <span className="ml-1">(Overdue)</span>}
                            </div>
                          )}
                          
                          <span className="text-xs text-muted-foreground">
                            Created {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingTask(task)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6 text-center py-12">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tasks Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No tasks match your search.' : 'Start organizing your tasks!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddOpen(true)} className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="gradient-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-primary">Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingTask.description}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={editingTask.priority} 
                    onValueChange={(value: any) => setEditingTask(prev => prev ? { ...prev, priority: value } : null)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <Button onClick={updateTask} className="w-full btn-gradient">
                <Edit className="h-4 w-4 mr-2" />
                Update Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};