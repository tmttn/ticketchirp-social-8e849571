
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { isFollowing, followUser, unfollowUser, getCurrentUser } from "@/utils/userUtils";
import { toast } from 'sonner';

interface FollowButtonProps {
  userId: string;
  compact?: boolean;
}

export const FollowButton = ({ userId, compact = false }: FollowButtonProps) => {
  const currentUser = getCurrentUser();
  const [following, setFollowing] = useState(isFollowing(currentUser.id, userId));
  
  // Don't show follow button for current user
  if (currentUser.id === userId) {
    return null;
  }

  const handleToggleFollow = () => {
    if (following) {
      unfollowUser(currentUser.id, userId);
      setFollowing(false);
      toast.success("Unfollowed successfully");
    } else {
      followUser(currentUser.id, userId);
      setFollowing(true);
      toast.success("Following successfully");
    }
  };

  if (compact) {
    return (
      <Button 
        variant={following ? "default" : "outline"} 
        size="sm" 
        onClick={handleToggleFollow}
        className={following ? "bg-primary hover:bg-primary/90" : ""}
      >
        {following ? (
          <UserCheck className="h-4 w-4" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
      </Button>
    );
  }
  
  return (
    <Button 
      variant={following ? "default" : "outline"} 
      size="sm" 
      onClick={handleToggleFollow}
      className={following ? "bg-primary hover:bg-primary/90" : ""}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          <span>Follow</span>
        </>
      )}
    </Button>
  );
};
