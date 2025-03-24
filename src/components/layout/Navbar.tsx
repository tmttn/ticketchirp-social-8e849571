
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Plus, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenu } from './MobileMenu';
import { Logo } from '../ui/Logo';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          <span className="font-bold text-xl hidden sm:inline-block">TicketChirp</span>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/scan')}
              className="relative text-brand-purple hover:text-brand-darkPurple transition-colors"
            >
              <Plus className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              className="relative text-brand-purple hover:text-brand-darkPurple transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-teal text-[10px] text-white">
                3
              </span>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <MobileMenu signOut={signOut} />
              </SheetContent>
            </Sheet>
            
            <Avatar className="cursor-pointer" onClick={() => navigate('/profile')}>
              <AvatarImage src={profile?.avatar_url || "https://github.com/shadcn.png"} />
              <AvatarFallback>
                {profile?.username?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="hidden sm:flex"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/auth?tab=signup')}
              className="gradient-bg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
