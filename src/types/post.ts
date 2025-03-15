
export interface Post {
  id: string;
  user_id: string;
  title: string;
  event_type: 'movie' | 'concert' | 'musical' | 'theater' | 'other';
  image_url: string;
  event_date: string;
  venue: string;
  content?: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  profile?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}
