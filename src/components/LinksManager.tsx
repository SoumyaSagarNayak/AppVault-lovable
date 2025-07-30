import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  Edit, 
  Tag,
  Link2,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: string;
  favicon?: string;
}

export const LinksManager = () => {
  const { toast } = useToast();
  const [links, setLinks] = useState<Link[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('app-vault-links');
    if (stored) {
      setLinks(JSON.parse(stored));
    }
  }, []);

  const saveLinks = (updatedLinks: Link[]) => {
    localStorage.setItem('app-vault-links', JSON.stringify(updatedLinks));
    setLinks(updatedLinks);
  };

  const addLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Title and URL are required.",
        variant: "destructive"
      });
      return;
    }

    const link: Link = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`,
      description: newLink.description,
      tags: newLink.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
      favicon: `https://www.google.com/s2/favicons?domain=${newLink.url}&sz=32`
    };

    saveLinks([...links, link]);
    setNewLink({ title: '', url: '', description: '', tags: '' });
    setIsAddOpen(false);
    
    toast({
      title: "Link Added",
      description: `${link.title} has been saved to your vault.`
    });
  };

  const updateLink = () => {
    if (!editingLink || !editingLink.title || !editingLink.url) return;

    const updatedLinks = links.map(link => 
      link.id === editingLink.id ? editingLink : link
    );
    
    saveLinks(updatedLinks);
    setEditingLink(null);
    
    toast({
      title: "Link Updated",
      description: "Your link has been updated successfully."
    });
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinks(updatedLinks);
    
    toast({
      title: "Link Deleted",
      description: "The link has been removed from your vault."
    });
  };

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const allTags = [...new Set(links.flatMap(link => link.tags))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Links Vault
          </h2>
          <p className="text-muted-foreground">Save and organize your favorite websites</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="gradient-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-primary">Add New Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newLink.title}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter link title"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newLink.description}
                  onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description (optional)"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={newLink.tags}
                  onChange={(e) => setNewLink(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="work, tools, reference (comma separated)"
                  className="bg-background/50"
                />
              </div>
              
              <Button onClick={addLink} className="w-full btn-gradient">
                <Link2 className="h-4 w-4 mr-2" />
                Save Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 5).map(tag => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSearchTerm(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((link) => (
          <Card 
            key={link.id} 
            className="gradient-card border-border/50 hover-scale hover-glow group transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {link.favicon && (
                    <img 
                      src={link.favicon} 
                      alt="" 
                      className="h-6 w-6 rounded flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingLink(link)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteLink(link.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {link.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
              )}
              
              {link.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {link.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(link.createdAt).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(link.url, '_blank')}
                  className="btn-glass"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6 text-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Links Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No links match your search.' : 'Start building your link collection!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddOpen(true)} className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Link
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingLink && (
        <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
          <DialogContent className="gradient-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-primary">Edit Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingLink.title}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={editingLink.url}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, url: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingLink.description}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  value={editingLink.tags.join(', ')}
                  onChange={(e) => setEditingLink(prev => prev ? { 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <Button onClick={updateLink} className="w-full btn-gradient">
                <Edit className="h-4 w-4 mr-2" />
                Update Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};