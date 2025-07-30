import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Save, Github, Linkedin, Mail, Instagram, Globe, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('app-vault-profile');
    return stored ? JSON.parse(stored) : {
      name: '',
      email: '',
      bio: '',
      avatar: '',
      social: {
        github: '',
        linkedin: '',
        instagram: '',
        website: '',
        phone: ''
      }
    };
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('app-vault-profile', JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto gradient-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <Card className="gradient-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-glass"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="gradient-card border-border/50">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="gradient-card border-border/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-primary">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    value={profile.social.github}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      social: { ...prev.social, github: e.target.value }
                    }))}
                    placeholder="github.com/username"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={profile.social.linkedin}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      social: { ...prev.social, linkedin: e.target.value }
                    }))}
                    placeholder="linkedin.com/in/username"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={profile.social.instagram}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      social: { ...prev.social, instagram: e.target.value }
                    }))}
                    placeholder="instagram.com/username"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={profile.social.website}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      social: { ...prev.social, website: e.target.value }
                    }))}
                    placeholder="yourwebsite.com"
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={profile.social.phone}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      social: { ...prev.social, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                    className="bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="btn-gradient">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};