
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { TicketCard } from '@/components/home/TicketCard';
import { toast } from 'sonner';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
  
  // Fetch follow counts
  const { data: followStats } = useQuery({
    queryKey: ['followStats', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      
      const { data: followers, error: followersError } = await supabase
        .from('follows')
        .select('follower_id', { count: 'exact' })
        .eq('following_id', id);
      
      if (followersError) throw followersError;
      
      const { data: following, error: followingError } = await supabase
        .from('follows')
        .select('following_id', { count: 'exact' })
        .eq('follower_id', id);
      
      if (followingError) throw followingError;
      
      return {
        followers: followers.length,
        following: following.length
      };
    },
    enabled: !!id,
  });
  
  // Check if current user is following this profile
  const { data: isFollowing, refetch: refetchFollowStatus } = useQuery({
    queryKey: ['isFollowing', id, user?.id],
    queryFn: async () => {
      if (!id || !user) return false;
      
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', id)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!(id && user),
  });
  
  // Fetch user's posts
  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      
      const { data: postsData, error: postsError } = await supabase
        .from('ticket_posts')
        .select(`
          *,
          likes_count:post_likes(count),
          comments_count:post_comments(count)
        `)
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Check if current user has liked these posts
      let likedPostIds = new Set();
      if (user) {
        const { data: likedPosts } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        
        if (likedPosts) {
          likedPostIds = new Set(likedPosts.map(like => like.post_id));
        }
      }
      
      return postsData.map(post => ({
        ...post,
        profile: {
          username: profile?.username || 'Unknown',
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url
        },
        likes_count: post.likes_count.length,
        comments_count: post.comments_count.length,
        user_has_liked: likedPostIds.has(post.id) || false
      }));
    },
    enabled: !!id && !!profile,
  });
  
  const toggleFollow = async () => {
    if (!user) {
      toast.error('You must be logged in to follow users');
      return;
    }
    
    if (user.id === id) {
      toast.error('You cannot follow yourself');
      return;
    }
    
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', id);
        
        if (error) throw error;
        toast.success(`Unfollowed @${profile?.username}`);
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: id
          });
        
        if (error) throw error;
        toast.success(`Following @${profile?.username}`);
      }
      
      refetchFollowStatus();
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast.error('Failed to update follow status');
    }
  };
  
  if (profileLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-4" />
        <div className="flex justify-center space-x-4 mb-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-64 w-full mb-4" />
        ))}
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container py-8 text-center">
        <p className="text-red-500">User not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-4 max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card className="mb-8">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <img 
                src={profile.avatar_url || 'https://i.pravatar.cc/150?img=1'} 
                alt={profile.username} 
              />
            </Avatar>
            
            <h1 className="text-2xl font-bold mb-1">@{profile.username}</h1>
            
            {profile.bio && (
              <p className="text-muted-foreground text-center max-w-md mb-4">{profile.bio}</p>
            )}
            
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">{followStats?.followers || 0}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-medium">{followStats?.following || 0}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
            </div>
            
            {user && user.id !== id && (
              <Button 
                variant={isFollowing ? "outline" : "default"} 
                onClick={toggleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      
      {postsLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : userPosts && userPosts.length > 0 ? (
        <div className="space-y-4">
          {userPosts.map(post => (
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
      ) : (
        <p className="text-muted-foreground">No posts yet</p>
      )}
    </div>
  );
};

export default UserProfile;
