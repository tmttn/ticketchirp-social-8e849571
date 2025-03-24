
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FollowStatsData {
  followingCount: number;
  followersCount: number;
}

export const useFollowStats = (
  userId: string, 
  initialFollowingCount?: number, 
  initialFollowersCount?: number
) => {
  const [followingCount, setFollowingCount] = useState(initialFollowingCount ?? 0);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount ?? 0);

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

  return {
    followingCount,
    followersCount
  };
};
