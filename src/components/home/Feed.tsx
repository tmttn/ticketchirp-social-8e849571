
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TicketCard } from './TicketCard';
import { Post } from '@/types/post';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const fetchPosts = async (userId?: string) => {
  console.log('Fetching posts with userId:', userId);
  
  try {
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

    console.log('Posts data from DB:', postsData);
    
    if (!postsData || postsData.length === 0) {
      // Return empty array if no posts
      return [];
    }
    
    // Fetch profiles for the user_ids in the posts
    const userIds = [...new Set(postsData.map(post => post.user_id))];
    
    let profilesMap = new Map();
    
    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Create a map of profiles by user_id for quick lookup
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }
    
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
        likes_count: post.likes_count?.length || 0,
        comments_count: post.comments_count?.length || 0,
        user_has_liked: likedPostIds.has(post.id) || false
      };
    });
    
    console.log('Processed posts:', posts);
    return posts as Post[];
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    throw error;
  }
};

export const Feed = () => {
  const { user } = useAuth();
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchPosts(user?.id),
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (err) => {
      console.error('Feed query error:', err);
      toast.error('Failed to load posts. Please try again.');
    }
  });
  
  // Add debug effect to log render cycles
  useEffect(() => {
    console.log('Feed rendering with user ID:', user?.id);
    console.log('Current posts state:', posts);
  }, [user?.id, posts]);
  
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
    console.error("Feed error:", error);
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading posts. Please try again later.</p>
        <pre className="text-xs mt-2 text-left bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
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
            name: post.profile?.username || 'Unknown User',
            avatar: post.profile?.avatar_url || 'https://i.pravatar.cc/150?img=1',
            initials: (post.profile?.username || 'UN').substring(0, 2).toUpperCase(),
          }}
          event={{
            title: post.title,
            type: (post.event_type as 'movie' | 'concert' | 'musical' | 'theater' | 'other') || 'other',
            image: post.image_url || 'https://via.placeholder.com/400x300',
            date: post.event_date ? new Date(post.event_date).toLocaleString() : 'Unknown date',
            venue: post.venue || 'Unknown venue',
          }}
          likes={post.likes_count || 0}
          comments={post.comments_count || 0}
          isLiked={post.user_has_liked || false}
        />
      ))}
    </div>
  );
};
