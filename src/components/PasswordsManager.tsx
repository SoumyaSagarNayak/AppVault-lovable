import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Eye,
  EyeOff,
  Copy,
  Lock,
  Key,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Password {
  id: string;
  title: string;
  website: string;
  username: string;
  password: string;
  notes: string;
  strength: 'weak' | 'medium' | 'strong';
  createdAt: string;
  lastUpdated: string;
}

export const PasswordsManager = () => {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [newPassword, setNewPassword] = useState({
    title: '',
    website: '',
    username: '',
    password: '',
    notes: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('app-vault-passwords');
    if (stored) {
      // In a real app, you'd decrypt the passwords here
      setPasswords(JSON.parse(stored));
    }
  }, []);

  const savePasswords = (updatedPasswords: Password[]) => {
    // In a real app, you'd encrypt the passwords before storing
    localStorage.setItem('app-vault-passwords', JSON.stringify(updatedPasswords));
    setPasswords(updatedPasswords);
  };

  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  const generatePassword = (length: number = 16): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const addPassword = () => {
    if (!newPassword.title || !newPassword.password) {
      toast({
        title: "Error",
        description: "Title and password are required.",
        variant: "destructive"
      });
      return;
    }

    const password: Password = {
      id: Date.now().toString(),
      title: newPassword.title,
      website: newPassword.website,
      username: newPassword.username,
      password: newPassword.password, // In real app, this would be encrypted
      notes: newPassword.notes,
      strength: calculatePasswordStrength(newPassword.password),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    savePasswords([...passwords, password]);
    setNewPassword({ title: '', website: '', username: '', password: '', notes: '' });
    setIsAddOpen(false);
    
    toast({
      title: "Password Added",
      description: `${password.title} has been saved to your vault.`
    });
  };

  const updatePassword = () => {
    if (!editingPassword || !editingPassword.title || !editingPassword.password) return;

    const updatedPassword = {
      ...editingPassword,
      strength: calculatePasswordStrength(editingPassword.password),
      lastUpdated: new Date().toISOString()
    };

    const updatedPasswords = passwords.map(pwd => 
      pwd.id === editingPassword.id ? updatedPassword : pwd
    );
    
    savePasswords(updatedPasswords);
    setEditingPassword(null);
    
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully."
    });
  };

  const deletePassword = (id: string) => {
    const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
    savePasswords(updatedPasswords);
    
    toast({
      title: "Password Deleted",
      description: "The password has been removed from your vault."
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return { color: 'text-red-400', bg: 'bg-red-400', value: 33 };
      case 'medium': return { color: 'text-yellow-400', bg: 'bg-yellow-400', value: 66 };
      case 'strong': return { color: 'text-green-400', bg: 'bg-green-400', value: 100 };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400', value: 0 };
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'weak': return AlertTriangle;
      case 'medium': return Shield;
      case 'strong': return CheckCircle;
      default: return Lock;
    }
  };

  const filteredPasswords = passwords.filter(pwd =>
    pwd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: passwords.length,
    weak: passwords.filter(p => p.strength === 'weak').length,
    medium: passwords.filter(p => p.strength === 'medium').length,
    strong: passwords.filter(p => p.strength === 'strong').length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Password Vault
          </h2>
          <p className="text-muted-foreground">Securely store and manage your passwords</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Password
            </Button>
          </DialogTrigger>
          <DialogContent className="gradient-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary">Add New Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPassword.title}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Gmail, Facebook"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newPassword.website}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={newPassword.username}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="your@email.com"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex space-x-2">
                  <Input
                    id="password"
                    type="password"
                    value={newPassword.password}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="bg-background/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const generated = generatePassword();
                      setNewPassword(prev => ({ ...prev, password: generated }));
                    }}
                    className="btn-glass"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                {newPassword.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Password Strength</span>
                      <Badge className={getStrengthColor(calculatePasswordStrength(newPassword.password)).color}>
                        {calculatePasswordStrength(newPassword.password)}
                      </Badge>
                    </div>
                    <Progress 
                      value={getStrengthColor(calculatePasswordStrength(newPassword.password)).value}
                      className="h-2"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={newPassword.notes}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                  className="bg-background/50"
                />
              </div>
              
              <Button onClick={addPassword} className="w-full btn-gradient">
                <Key className="h-4 w-4 mr-2" />
                Save Password
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
              <p className="text-sm text-muted-foreground">Total Passwords</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.strong}</div>
              <p className="text-sm text-muted-foreground">Strong</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
              <p className="text-sm text-muted-foreground">Medium</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.weak}</div>
              <p className="text-sm text-muted-foreground">Weak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Passwords List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPasswords.map((password) => {
          const strengthData = getStrengthColor(password.strength);
          const StrengthIcon = getStrengthIcon(password.strength);
          const isVisible = visiblePasswords.has(password.id);
          
          return (
            <Card 
              key={password.id} 
              className="gradient-card border-border/50 hover-scale hover-glow group transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg gradient-primary flex-shrink-0">
                      <Lock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                        {password.title}
                      </CardTitle>
                      {password.website && (
                        <p className="text-sm text-muted-foreground truncate">{password.website}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={`${strengthData.color} flex items-center space-x-1`}>
                      <StrengthIcon className="h-3 w-3" />
                      <span className="text-xs">{password.strength}</span>
                    </Badge>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingPassword(password)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePassword(password.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {password.username && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                    <span className="text-sm font-medium">Username:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">{password.username}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(password.username, 'Username')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span className="text-sm font-medium">Password:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono">
                      {isVisible ? password.password : '••••••••'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePasswordVisibility(password.id)}
                      className="h-6 w-6 p-0"
                    >
                      {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(password.password, 'Password')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {password.notes && (
                  <p className="text-sm text-muted-foreground italic">
                    {password.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>Created: {new Date(password.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(password.lastUpdated).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPasswords.length === 0 && (
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6 text-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Passwords Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No passwords match your search.' : 'Start securing your accounts!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddOpen(true)} className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Password
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingPassword && (
        <Dialog open={!!editingPassword} onOpenChange={() => setEditingPassword(null)}>
          <DialogContent className="gradient-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary">Edit Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingPassword.title}
                    onChange={(e) => setEditingPassword(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={editingPassword.website}
                    onChange={(e) => setEditingPassword(prev => prev ? { ...prev, website: e.target.value } : null)}
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Username/Email</Label>
                <Input
                  value={editingPassword.username}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, username: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    value={editingPassword.password}
                    onChange={(e) => setEditingPassword(prev => prev ? { ...prev, password: e.target.value } : null)}
                    className="bg-background/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (editingPassword) {
                        const generated = generatePassword();
                        setEditingPassword(prev => prev ? { ...prev, password: generated } : null);
                      }
                    }}
                    className="btn-glass"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={editingPassword.notes}
                  onChange={(e) => setEditingPassword(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <Button onClick={updatePassword} className="w-full btn-gradient">
                <Edit className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};