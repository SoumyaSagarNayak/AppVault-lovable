import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  Edit, 
  FileText,
  Eye,
  File,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFFile {
  id: string;
  name: string;
  originalName: string;
  description: string;
  tags: string[];
  size: number;
  uploadedAt: string;
  data: string; // Base64 encoded PDF data
}

export const PDFsManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDFFile | null>(null);
  const [newPdf, setNewPdf] = useState({
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('app-vault-pdfs');
    if (stored) {
      setPdfs(JSON.parse(stored));
    }
  }, []);

  const savePdfs = (updatedPdfs: PDFFile[]) => {
    localStorage.setItem('app-vault-pdfs', JSON.stringify(updatedPdfs));
    setPdfs(updatedPdfs);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Error",
          description: "Please select a PDF file.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Error",
          description: "File size must be less than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      setIsAddOpen(true);
    }
  };

  const uploadPdf = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a PDF file.",
        variant: "destructive"
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        
        const pdf: PDFFile = {
          id: Date.now().toString(),
          name: newPdf.description || selectedFile.name.replace('.pdf', ''),
          originalName: selectedFile.name,
          description: newPdf.description,
          tags: newPdf.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          size: selectedFile.size,
          uploadedAt: new Date().toISOString(),
          data: base64Data
        };

        savePdfs([...pdfs, pdf]);
        setNewPdf({ description: '', tags: '' });
        setSelectedFile(null);
        setIsAddOpen(false);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast({
          title: "PDF Uploaded",
          description: `${pdf.name} has been saved to your vault.`
        });
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updatePdf = () => {
    if (!editingPdf) return;

    const updatedPdfs = pdfs.map(pdf => 
      pdf.id === editingPdf.id ? editingPdf : pdf
    );
    
    savePdfs(updatedPdfs);
    setEditingPdf(null);
    
    toast({
      title: "PDF Updated",
      description: "Your PDF has been updated successfully."
    });
  };

  const deletePdf = (id: string) => {
    const updatedPdfs = pdfs.filter(pdf => pdf.id !== id);
    savePdfs(updatedPdfs);
    
    toast({
      title: "PDF Deleted",
      description: "The PDF has been removed from your vault."
    });
  };

  const downloadPdf = (pdf: PDFFile) => {
    try {
      const link = document.createElement('a');
      link.href = pdf.data;
      link.download = pdf.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `Downloading ${pdf.name}...`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF.",
        variant: "destructive"
      });
    }
  };

  const viewPdf = (pdf: PDFFile) => {
    try {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${pdf.name}</title>
              <style>
                body { margin: 0; padding: 0; font-family: system-ui; }
                .header { background: #1a1a1a; color: white; padding: 1rem; text-align: center; }
                iframe { width: 100%; height: calc(100vh - 60px); border: none; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>${pdf.name}</h2>
              </div>
              <iframe src="${pdf.data}" type="application/pdf"></iframe>
            </body>
          </html>
        `);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open PDF viewer.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredPdfs = pdfs.filter(pdf =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const allTags = [...new Set(pdfs.flatMap(pdf => pdf.tags))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PDF Vault
          </h2>
          <p className="text-muted-foreground">Store and organize your documents</p>
        </div>
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="btn-gradient"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload PDF
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Search and Filters */}
      <Card className="gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PDFs..."
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

      {/* PDFs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPdfs.map((pdf) => (
          <Card 
            key={pdf.id} 
            className="gradient-card border-border/50 hover-scale hover-glow group transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg gradient-primary flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                      {pdf.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(pdf.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingPdf(pdf)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePdf(pdf.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {pdf.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {pdf.description}
                </p>
              )}
              
              {pdf.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pdf.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(pdf.uploadedAt).toLocaleDateString()}
                </span>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => viewPdf(pdf)}
                    className="btn-glass"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadPdf(pdf)}
                    className="btn-glass"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPdfs.length === 0 && (
        <Card className="gradient-card border-border/50">
          <CardContent className="pt-6 text-center py-12">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No PDFs Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No PDFs match your search.' : 'Start building your document library!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => fileInputRef.current?.click()} className="btn-gradient">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First PDF
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="gradient-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-primary">Upload PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFile && (
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Name/Description</Label>
              <Input
                id="description"
                value={newPdf.description}
                onChange={(e) => setNewPdf(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter a name or description"
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={newPdf.tags}
                onChange={(e) => setNewPdf(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="work, important, reference (comma separated)"
                className="bg-background/50"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  setIsAddOpen(false);
                  setSelectedFile(null);
                  setNewPdf({ description: '', tags: '' });
                }} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={uploadPdf} className="flex-1 btn-gradient">
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingPdf && (
        <Dialog open={!!editingPdf} onOpenChange={() => setEditingPdf(null)}>
          <DialogContent className="gradient-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-primary">Edit PDF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingPdf.name}
                  onChange={(e) => setEditingPdf(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingPdf.description}
                  onChange={(e) => setEditingPdf(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  value={editingPdf.tags.join(', ')}
                  onChange={(e) => setEditingPdf(prev => prev ? { 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  } : null)}
                  className="bg-background/50"
                />
              </div>
              
              <Button onClick={updatePdf} className="w-full btn-gradient">
                <Edit className="h-4 w-4 mr-2" />
                Update PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};