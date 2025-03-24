
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, User, Ticket, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { AvatarUpload } from '@/components/profile/AvatarUpload';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const menuItems = [
    { 
      label: 'My Tickets', 
      icon: Ticket, 
      action: () => handleNavigate('/tickets'),
      description: 'View and manage your ticket collection'
    },
    { 
      label: 'Public Profile', 
      icon: User, 
      action: () => handleNavigate(`/profile/${user.id}`),
      description: 'View your public profile as others see it'
    },
    { 
      label: 'Settings', 
      icon: SettingsIcon, 
      action: () => handleNavigate('/settings'),
      description: 'Manage your account and preferences'
    },
    { 
      label: 'Sign Out', 
      icon: LogOut, 
      action: signOut,
      description: 'Sign out of your account',
      variant: 'destructive' as const
    }
  ];
  
  return (
    <div className="container py-4 max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center">
            <AvatarUpload 
              avatarUrl={profile?.avatar_url}
              username={profile?.username}
              size="lg"
              className="mb-4"
            />
            
            <h1 className="text-2xl font-bold">@{profile?.username || 'User'}</h1>
            <p className="text-muted-foreground">{profile?.full_name || ''}</p>
          </div>
        </CardHeader>
        
        <CardContent>
          {profile?.bio && (
            <p className="text-center mb-6">{profile.bio}</p>
          )}
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Account</h2>
      
      <div className="space-y-4">
        {menuItems.map((item) => (
          <Card 
            key={item.label} 
            className="overflow-hidden cursor-pointer hover:bg-accent/20 transition-colors"
            onClick={item.action}
          >
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className={`p-2 rounded-full mr-4 ${item.variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${item.variant === 'destructive' ? 'text-destructive' : ''}`}>{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Profile;
