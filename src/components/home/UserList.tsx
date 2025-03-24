
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "./FollowButton";

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
      {users.map(user => {
        const initials = user.username?.substring(0, 2).toUpperCase() || 'U';
        
        return (
          <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.full_name || user.username}</p>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>
            <FollowButton userId={user.id} />
          </div>
        );
      })}
    </div>
  );
};
