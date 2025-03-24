
import { Post } from '@/types/post';
import { supabase } from '@/integrations/supabase/client';

export const fetchPosts = async (userId?: string): Promise<Post[]> => {
  console.log('Fetching posts with userId:', userId);
  
  try {
    if (!userId) {
      console.log('No user ID provided for fetching posts');
      return [];
    }

    // First, get the list of users the current user is following
    const { data: followingData, error: followingError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    
    if (followingError) {
      console.error('Error fetching following data:', followingError);
      throw followingError;
    }

    // Extract the IDs of users being followed
    const followingIds = followingData?.map(f => f.following_id) || [];
    
    // Include the current user's ID in the list of users to fetch posts from
    const userIds = [userId, ...followingIds];
    
    console.log('Fetching posts for users:', userIds);
    
    // Fetch posts from the current user and followed users
    const { data: postsData, error: postsError } = await supabase
      .from('ticket_posts')
      .select(`
        *,
        likes_count:post_likes(count),
        comments_count:post_comments(count)
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false });
    
    if (postsError) {
      console.error('Error fetching posts:', postsError);
      throw postsError;
    }

    console.log('Posts data from DB:', postsData);
    
    if (!postsData || postsData.length === 0) {
      console.log('No posts found for the user and followed users');
      return [];
    }
    
    // Fetch profiles for the user_ids in the posts
    const postUserIds = [...new Set(postsData.map(post => post.user_id))];
    
    let profilesMap = new Map();
    
    if (postUserIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', postUserIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Create a map of profiles by user_id for quick lookup
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }
    
    // Check which posts the current user has liked
    const { data: likedPosts, error: likesError } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);
    
    if (likesError) {
      console.error('Error fetching liked posts:', likesError);
      throw likesError;
    }
    
    const likedPostIds = new Set(likedPosts?.map(like => like.post_id) || []);
    
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

export const addComment = async (postId: string, userId: string, content: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('post_comments')
      .insert([
        { post_id: postId, user_id: userId, content }
      ]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const fetchComments = async (postId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles:user_id(username, full_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const toggleLike = async (postId: string, userId: string, isLiked: boolean): Promise<void> => {
  try {
    if (isLiked) {
      // Unlike the post
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      // Like the post
      const { error } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: userId }]);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};
