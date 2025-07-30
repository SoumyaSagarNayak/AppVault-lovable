import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Instagram,
  ExternalLink,
  Code,
  Heart,
  Coffee,
  Star
} from 'lucide-react';

export const CreatorSection = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/SoumyaSagarNayak',
      icon: Github,
      color: 'hover:text-gray-400',
      description: 'Check out my code repositories'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/soumya-sagar-nayak-498352295',
      icon: Linkedin,
      color: 'hover:text-blue-400',
      description: 'Connect with me professionally'
    },
    {
      name: 'Email',
      url: 'mailto:soumyasagarnayak351@gmail.com',
      icon: Mail,
      color: 'hover:text-red-400',
      description: 'Reach out via email'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/ice_soum',
      icon: Instagram,
      color: 'hover:text-pink-400',
      description: 'Follow my journey'
    }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const technologies = [
    'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB', 
    'Express', 'Next.js', 'Python', 'JavaScript', 'Git'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 py-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Meet the Creator
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Passionate full-stack developer crafting beautiful and functional web applications
        </p>
      </div>

      {/* Main Creator Card */}
      <Card className="gradient-card border-border/50 hover-glow">
        <CardContent className="pt-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar/Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-lg">
                SN
              </div>
            </div>
            
            {/* Creator Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  Soumya Sagar Nayak
                </h3>
                <p className="text-xl text-primary font-medium mb-3">
                  Full-Stack Developer
                </p>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  I'm passionate about creating innovative web applications that solve real-world problems. 
                  With expertise in modern technologies like React, TypeScript, and Node.js, I enjoy 
                  building user-friendly interfaces and robust backend systems.
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Aspiring Learner</div>
                  <div className="text-sm text-muted-foreground">In Coding</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Solo Work</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">Creativity</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            <span>Connect With Me</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialLinks.map((link) => (
              <Card 
                key={link.name}
                className="gradient-glow border-border/50 hover-scale hover-glow cursor-pointer transition-all duration-300 group"
                onClick={() => handleLinkClick(link.url)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full gradient-primary group-hover:scale-110 transition-transform">
                      <link.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {link.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-primary" />
            <span>Technologies & Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <Badge 
                key={tech}
                variant="secondary"
                className="px-4 py-2 text-sm font-medium hover-scale transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About This Project */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-400" />
            <span>About App Vault</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            App Vault was created as a comprehensive productivity solution that combines 
            security, organization, and beautiful design. This project showcases modern 
            web development practices including:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center">
                <Star className="h-4 w-4 text-warning mr-2" />
                Frontend Features
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• React with TypeScript</li>
                <li>• Tailwind CSS Design System</li>
                <li>• Responsive Mobile-First Design</li>
                <li>• Dark/Light Theme Support</li>
                <li>• Smooth Animations & Transitions</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center">
                <Star className="h-4 w-4 text-warning mr-2" />
                Core Functionality
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Secure Password Management</li>
                <li>• Document Storage & Organization</li>
                <li>• Task Management with Tracking</li>
                <li>• Link Bookmarking System</li>
                <li>• Calendar with Activity Tracking</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              <Coffee className="h-4 w-4 inline mr-1" />
              Built with passion and attention to detail. Hope you enjoy using App Vault!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="gradient-card border-border/50 text-center">
        <CardContent className="pt-8 pb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Let's Build Something Amazing Together!
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Interested in collaborating or have a project in mind? 
              I'd love to hear from you and discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={() => handleLinkClick('mailto:soumyasagarnayak351@gmail.com')}
                className="btn-gradient"
              >
                <Mail className="h-4 w-4 mr-2" />
                Get In Touch
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleLinkClick('https://github.com/SoumyaSagarNayak')}
                className="btn-glass"
              >
                <Github className="h-4 w-4 mr-2" />
                View My Work
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};