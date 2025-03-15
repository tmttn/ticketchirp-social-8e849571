
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TicketCard } from './TicketCard';
import { Post } from '@/types/post';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const fetchPosts = async (userId?: string) => {
  let query = supabase
    .from('ticket_posts')
    .select(`
      *,
      profile:profiles(username, full_name, avatar_url),
      likes_count:post_likes(count),
      comments_count:post_comments(count)
    `)
    .order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
  
  // If a user is logged in, check which posts they've liked
  if (userId) {
    const { data: likedPosts, error: likesError } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);
    
    if (!likesError && likedPosts) {
      // Mark posts that the user has liked
      const likedPostIds = new Set(likedPosts.map(like => like.post_id));
      data.forEach(post => {
        post.user_has_liked = likedPostIds.has(post.id);
      });
    }
  }
  
  return data as Post[];
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
