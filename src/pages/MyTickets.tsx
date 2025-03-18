
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/home/TicketCard';
import { ArrowLeft, Plus } from 'lucide-react';

// Define the acceptable event types to match what TicketCard expects
type EventType = 'movie' | 'concert' | 'musical' | 'theater' | 'other';

const MyTickets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['myTickets', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ticket_posts')
        .select(`
          *,
          likes_count:post_likes(count),
          comments_count:post_comments(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // Get liked posts for this user
      const { data: likedPosts } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);
      
      const likedPostIds = new Set(likedPosts?.map(like => like.post_id) || []);
      
      return data?.map(ticket => ({
        ...ticket,
        profile: profileData,
        likes_count: ticket.likes_count.length,
        comments_count: ticket.comments_count.length,
        user_has_liked: likedPostIds.has(ticket.id)
      })) || [];
    },
    enabled: !!user,
  });
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="container py-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button onClick={() => navigate('/scan')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Ticket
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <TicketCard 
              key={ticket.id}
              id={ticket.id}
              user={{
                id: ticket.user_id,
                name: ticket.profile?.username || 'Unknown',
                avatar: ticket.profile?.avatar_url || 'https://i.pravatar.cc/150?img=1',
                initials: (ticket.profile?.username || 'UN').substring(0, 2).toUpperCase(),
              }}
              event={{
                title: ticket.title,
                type: (ticket.event_type as EventType) || 'other',
                image: ticket.image_url || '',
                date: new Date(ticket.event_date || '').toLocaleString(),
                venue: ticket.venue || '',
              }}
              likes={ticket.likes_count || 0}
              comments={ticket.comments_count || 0}
              isLiked={ticket.user_has_liked || false}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">You haven't added any tickets yet</p>
            <Button onClick={() => navigate('/scan')}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Ticket
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyTickets;
