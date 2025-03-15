
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface FollowButtonProps {
  userId: string;
  compact?: boolean;
}

export const FollowButton = ({ userId, compact = false }: FollowButtonProps) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Don't show follow button for current user or when not logged in
  if (!user || user.id === userId) {
    return null;
  }

  useEffect(() => {
    if (user) {
      checkIfFollowing();
    }
  }, [user, userId]);

  const checkIfFollowing = async () => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error('Error checking follow status:', error);
        return;
      }
      
      setFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleToggleFollow = async () => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return;
    }

    setIsLoading(true);
    
    try {
      if (following) {
        // Unfollow user
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        if (error) {
          toast.error('Failed to unfollow');
          console.error('Error unfollowing:', error);
          return;
        }
        
        setFollowing(false);
        toast.success('Unfollowed successfully');
      } else {
        // Follow user
        const { error } = await supabase
          .from('follows')
          .insert([
            { follower_id: user.id, following_id: userId }
          ]);
        
        if (error) {
          toast.error('Failed to follow');
          console.error('Error following:', error);
          return;
        }
        
        setFollowing(true);
        toast.success('Following successfully');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <Button 
        variant={following ? "default" : "outline"} 
        size="sm" 
        onClick={handleToggleFollow}
        className={following ? "bg-primary hover:bg-primary/90" : ""}
        disabled={isLoading}
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
      disabled={isLoading}
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
