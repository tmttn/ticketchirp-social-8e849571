
import { useNavigate } from "react-router-dom";
import { FollowButton } from "./FollowButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AvatarUpload } from "../profile/AvatarUpload";

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

interface UserListProps {
  users: Profile[];
  isLoading: boolean;
}

export const UserList = ({ users, isLoading }: UserListProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="rounded-lg border p-6 text-center space-y-4">
        <h3 className="font-medium text-lg">Sign in to connect</h3>
        <p className="text-muted-foreground text-sm">
          Create an account to follow other users and share your experiences
        </p>
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/auth')}
          >
            Log in
          </Button>
          <Button 
            className="gradient-bg hover:opacity-90"
            onClick={() => navigate('/auth?tab=signup')}
          >
            Sign up
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading...
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {users.map(profile => (
        <div key={profile.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
          <div className="flex items-center gap-3">
            <AvatarUpload
              avatarUrl={profile.avatar_url}
              username={profile.username}
              size="sm"
            />
            <div>
              <p className="font-medium">{profile.full_name || profile.username}</p>
              <p className="text-xs text-muted-foreground">
                @{profile.username}
              </p>
            </div>
          </div>
          <FollowButton userId={profile.id} />
        </div>
      ))}
    </div>
  );
};
