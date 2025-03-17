
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TicketCard } from './TicketCard';
import { Post } from '@/types/post';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const fetchPosts = async (userId?: string) => {
  // First, fetch all posts
  const { data: postsData, error: postsError } = await supabase
    .from('ticket_posts')
    .select(`
      *,
      likes_count:post_likes(count),
      comments_count:post_comments(count)
    `)
    .order('created_at', { ascending: false });
  
  if (postsError) {
    console.error('Error fetching posts:', postsError);
    throw postsError;
  }
  
  // Fetch profiles for the user_ids in the posts
  const userIds = [...new Set(postsData.map(post => post.user_id))];
  
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .in('id', userIds);
  
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }
  
  // Create a map of profiles by user_id for quick lookup
  const profilesMap = new Map();
  profilesData?.forEach(profile => {
    profilesMap.set(profile.id, profile);
  });
  
  // If a user is logged in, check which posts they've liked
  let likedPostIds = new Set();
  if (userId) {
    const { data: likedPosts, error: likesError } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);
    
    if (!likesError && likedPosts) {
      likedPostIds = new Set(likedPosts.map(like => like.post_id));
    }
  }
  
  // Combine the data into the format expected by the Post type
  const posts = postsData.map(post => {
    const profile = profilesMap.get(post.user_id);
    return {
      ...post,
      profile: profile ? {
        username: profile.username || 'Unknown',
        full_name: profile.full_name,
        avatar_url: profile.avatar_url
      } : {
        username: 'Unknown User',
        full_name: null,
        avatar_url: null
      },
      likes_count: post.likes_count.length,
      comments_count: post.comments_count.length,
      user_has_liked: likedPostIds.has(post.id) || false
    };
  });
  
  return posts as Post[];
};

export const Feed = () => {
  const { user } = useAuth();
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchPosts(user?.id),
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full rounded-lg border border-gray-200 shadow">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </div>
            </div>
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading posts. Please try again later.</p>
      </div>
    );
  }
  
  if (!posts || posts.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 py-4">
      {posts.map((post) => (
        <TicketCard 
          key={post.id}
          id={post.id}
          user={{
            id: post.user_id,
            name: post.profile?.full_name || post.profile?.username || 'Unknown User',
            avatar: post.profile?.avatar_url || 'https://i.pravatar.cc/150?img=1',
            initials: (post.profile?.username || 'UN').substring(0, 2).toUpperCase(),
          }}
          event={{
            title: post.title,
            type: post.event_type,
            image: post.image_url,
            date: new Date(post.event_date).toLocaleString(),
            venue: post.venue,
          }}
          likes={post.likes_count || 0}
          comments={post.comments_count || 0}
          isLiked={post.user_has_liked || false}
        />
      ))}
    </div>
  );
};
