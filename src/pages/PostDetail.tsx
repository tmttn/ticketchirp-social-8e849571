
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageCircle, Share } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile?: {
    username: string;
    avatar_url: string | null;
  };
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  // Fetch post details
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
      const { data: postData, error: postError } = await supabase
        .from('ticket_posts')
        .select(`
          *,
          likes_count:post_likes(count),
          user_has_liked:post_likes!inner(user_id)
        `)
        .eq('id', id)
        .single();
      
      if (postError) throw postError;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', postData.user_id)
        .single();
      
      return {
        ...postData,
        profile: profileData,
        likes_count: postData.likes_count.length,
        user_has_liked: user ? postData.user_has_liked.some((like: any) => like.user_id === user.id) : false
      };
    },
    enabled: !!id,
  });

  // Fetch comments
  const { 
    data: comments, 
    isLoading: commentsLoading, 
    error: commentsError,
    refetch: refetchComments 
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
      const { data: commentsData, error: commentsError } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Fetch profiles for comment authors
      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
      
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      return commentsData.map(comment => ({
        ...comment,
        profile: profilesMap.get(comment.user_id) || {
          username: 'Unknown User',
          avatar_url: null
        }
      }));
    },
    enabled: !!id,
  });

  const handleAddComment = async () => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment.trim()
        });
      
      if (error) throw error;
      
      toast.success('Comment added successfully');
      setNewComment('');
      refetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error('You must be logged in to like posts');
      return;
    }
    
    try {
      if (post.user_has_liked) {
        // Unlike the post
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        toast.success('Post unliked');
      } else {
        // Like the post
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: id,
            user_id: user.id
          });
        
        if (error) throw error;
        
        toast.success('Post liked');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    }
  };

  if (postLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="container py-8 text-center">
        <p className="text-red-500">Error loading post details</p>
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
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <Avatar 
              className="h-10 w-10 cursor-pointer" 
              onClick={() => navigate(`/profile/${post.user_id}`)}
            >
              <img 
                src={post.profile?.avatar_url || 'https://i.pravatar.cc/150?img=1'} 
                alt={post.profile?.username || 'User'}
              />
            </Avatar>
            <div>
              <h3 
                className="font-medium text-sm cursor-pointer hover:underline"
                onClick={() => navigate(`/profile/${post.user_id}`)}
              >
                {post.profile?.username || 'Unknown User'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4">{post.title}</h2>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <span className="capitalize">{post.event_type}</span>
            {post.venue && (
              <>
                <span className="mx-2">•</span>
                <span>{post.venue}</span>
              </>
            )}
            {post.event_date && (
              <>
                <span className="mx-2">•</span>
                <span>{new Date(post.event_date).toLocaleString()}</span>
              </>
            )}
          </div>
        </CardHeader>
        
        <div className="relative aspect-video w-full overflow-hidden">
          <img 
            src={post.image_url || 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200'} 
            alt={post.title} 
            className="object-cover w-full h-full"
          />
        </div>
        
        <CardContent className="pt-4">
          <p className="text-sm">{post.content}</p>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleLike} className={post.user_has_liked ? 'text-red-500' : ''}>
              <Heart className={`mr-1 h-4 w-4 ${post.user_has_liked ? 'fill-current' : ''}`} />
              <span>{post.likes_count}</span>
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="mr-1 h-4 w-4" />
              <span>{comments?.length || 0}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Comments</h3>
        {user ? (
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddComment}>Post</Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            You need to be logged in to comment
          </p>
        )}
        
        {commentsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : commentsError ? (
          <p className="text-red-500 text-sm">Error loading comments</p>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment: Comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <Avatar 
                      className="h-8 w-8 cursor-pointer" 
                      onClick={() => navigate(`/profile/${comment.user_id}`)}
                    >
                      <img 
                        src={comment.profile?.avatar_url || 'https://i.pravatar.cc/150?img=1'} 
                        alt={comment.profile?.username || 'User'} 
                      />
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 
                          className="text-sm font-medium cursor-pointer hover:underline"
                          onClick={() => navigate(`/profile/${comment.user_id}`)}
                        >
                          {comment.profile?.username || 'Unknown User'}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
