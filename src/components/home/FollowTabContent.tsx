
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserList } from "./UserList";
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

interface FollowTabContentProps {
  userId: string;
  activeTab: 'followers' | 'following';
  onTabChange: (tab: 'followers' | 'following') => void;
}

export const FollowTabContent = ({ userId, activeTab, onTabChange }: FollowTabContentProps) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchUsers(activeTab);
  }, [userId, activeTab]);

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

  return (
    <>
      <div className="flex gap-4 border-b pb-4">
        <Button 
          variant={activeTab === 'followers' ? "default" : "ghost"}
          onClick={() => onTabChange('followers')}
        >
          Followers
        </Button>
        <Button 
          variant={activeTab === 'following' ? "default" : "ghost"}
          onClick={() => onTabChange('following')}
        >
          Following
        </Button>
      </div>
      <div className="mt-4 overflow-y-auto h-[calc(100%-80px)]">
        <UserList 
          users={users}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
