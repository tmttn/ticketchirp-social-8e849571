
import { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "./FollowButton";
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface FollowStatsProps {
  userId: string;
  followingCount?: number;
  followersCount?: number;
}

export const FollowStats = ({ userId, followingCount: initialFollowingCount, followersCount: initialFollowersCount }: FollowStatsProps) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [followingCount, setFollowingCount] = useState(initialFollowingCount ?? 0);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount ?? 0);
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Only fetch counts from Supabase if they weren't provided as props
    if (initialFollowingCount === undefined || initialFollowersCount === undefined) {
      fetchFollowCounts();
    }
  }, [userId, initialFollowingCount, initialFollowersCount]);

  const fetchFollowCounts = async () => {
    try {
      // Get following count
      const { count: followingCount, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);
      
      if (followingError) {
        console.error('Error fetching following count:', followingError);
      } else {
        setFollowingCount(followingCount || 0);
      }
      
      // Get followers count
      const { count: followersCount, error: followersError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
      
      if (followersError) {
        console.error('Error fetching followers count:', followersError);
      } else {
        setFollowersCount(followersCount || 0);
      }
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    }
  };

  const fetchUsers = async (tab: 'followers' | 'following') => {
    setIsLoading(true);
    try {
      let query;
      
      if (tab === 'followers') {
        // Get users following this user
        const { data, error } = await supabase
          .from('follows')
          .select('follower_id')
          .eq('following_id', userId);
        
        if (error) {
          console.error('Error fetching followers:', error);
          setUsers([]);
          return;
        }
        
        const followerIds = data.map(item => item.follower_id);
        
        if (followerIds.length === 0) {
          setUsers([]);
          return;
        }
        
        // Get profile info for each follower
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', followerIds);
        
        if (profilesError) {
          console.error('Error fetching follower profiles:', profilesError);
          setUsers([]);
          return;
        }
        
        setUsers(profiles);
      } else {
        // Get users this user is following
        const { data, error } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', userId);
        
        if (error) {
          console.error('Error fetching following:', error);
          setUsers([]);
          return;
        }
        
        const followingIds = data.map(item => item.following_id);
        
        if (followingIds.length === 0) {
          setUsers([]);
          return;
        }
        
        // Get profile info for each following
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', followingIds);
        
        if (profilesError) {
          console.error('Error fetching following profiles:', profilesError);
          setUsers([]);
          return;
        }
        
        setUsers(profiles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'followers' | 'following') => {
    setActiveTab(tab);
    fetchUsers(tab);
  };
  
  return (
    <div className="flex gap-4 text-sm">
      <Sheet onOpenChange={() => handleTabChange('followers')}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className="px-2 h-auto"
          >
            <span className="font-bold">{followersCount}</span> 
            <span className="text-muted-foreground ml-1">followers</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80%] sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>
              <div className="flex gap-4 border-b pb-4">
                <Button 
                  variant={activeTab === 'followers' ? "default" : "ghost"}
                  onClick={() => handleTabChange('followers')}
                >
                  Followers
                </Button>
                <Button 
                  variant={activeTab === 'following' ? "default" : "ghost"}
                  onClick={() => handleTabChange('following')}
                >
                  Following
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto h-[calc(100%-80px)]">
            <UserList 
              users={users} 
              isLoading={isLoading}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={() => handleTabChange('following')}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className="px-2 h-auto"
          >
            <span className="font-bold">{followingCount}</span> 
            <span className="text-muted-foreground ml-1">following</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80%] sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>
              <div className="flex gap-4 border-b pb-4">
                <Button 
                  variant={activeTab === 'followers' ? "default" : "ghost"}
                  onClick={() => handleTabChange('followers')}
                >
                  Followers
                </Button>
                <Button 
                  variant={activeTab === 'following' ? "default" : "ghost"}
                  onClick={() => handleTabChange('following')}
                >
                  Following
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto h-[calc(100%-80px)]">
            <UserList 
              users={users}
              isLoading={isLoading}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface UserListProps {
  users: Profile[];
  isLoading: boolean;
}

const UserList = ({ users, isLoading }: UserListProps) => {
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
