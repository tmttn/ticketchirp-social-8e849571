
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TicketCard } from './TicketCard';
import { FeedSkeleton } from './FeedSkeleton';
import { EmptyFeed } from './EmptyFeed';
import { useAuth } from '@/context/AuthContext';
import { fetchPosts } from '@/utils/postUtils';
import { toast } from 'sonner';

export const Feed = () => {
  const { user } = useAuth();
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchPosts(user?.id),
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user?.id, // Only run the query if we have a user ID
    meta: {
      errorMessage: 'Failed to load posts'
    }
  });
  
  // Handle errors manually with an effect
  useEffect(() => {
    if (error) {
      console.error('Feed query error:', error);
      toast.error('Failed to load posts. Please try again.');
    }
  }, [error]);
  
  useEffect(() => {
    console.log('Feed rendering with user ID:', user?.id);
    console.log('Current posts state:', posts);
  }, [user?.id, posts]);
  
  if (!user) {
    return <EmptyFeed message="Please sign in to view your feed." />;
  }
  
  if (isLoading) {
    return <FeedSkeleton />;
  }
  
  if (error) {
    console.error("Feed error:", error);
    return <EmptyFeed message="Error loading posts. Please try again later." />;
  }
  
  if (!posts || posts.length === 0) {
    return <EmptyFeed message="No posts yet. Be the first to share!" />;
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
