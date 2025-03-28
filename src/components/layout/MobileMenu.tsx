
import { useNavigate } from 'react-router-dom';
import { Home, Ticket, Scan, User, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
  signOut: () => Promise<void>;
}

export const MobileMenu = ({ signOut }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const loggedInMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Ticket, label: 'My Tickets', path: '/tickets' },
    { icon: Scan, label: 'Scan Ticket', path: '/scan' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];
  
  const loggedOutMenuItems = [
    { icon: Home, label: 'Home', path: '/' }
  ];
  
  const menuItems = user ? loggedInMenuItems : loggedOutMenuItems;
  
  return (
    <div className="flex flex-col gap-6 py-4">
      <h2 className="text-lg font-semibold px-2">Menu</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="justify-start gap-3 px-2"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
        
        {user ? (
          <Button
            variant="ghost"
            className="justify-start gap-3 px-2 text-destructive hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              className="justify-start gap-3 px-2"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-5 w-5" />
              Login
            </Button>
            <Button
              variant="default"
              className="justify-start gap-3 px-2 mt-2"
              onClick={() => navigate('/auth?tab=signup')}
            >
              <User className="h-5 w-5" />
              Sign Up
            </Button>
          </>
        )}
      </nav>
    </div>
  );
};
