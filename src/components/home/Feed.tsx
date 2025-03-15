
import { TicketCard } from './TicketCard';
import { users } from '@/utils/userUtils';

// Map our existing dummy data to use the user IDs from our user system
const dummyData = [
  {
    id: '1',
    user: {
      name: users['1'].name,
      avatar: users['1'].avatar || 'https://i.pravatar.cc/150?img=1',
      initials: users['1'].initials,
    },
    event: {
      title: 'Oppenheimer',
      type: 'movie' as const,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1625',
      date: 'Today at 7:30 PM',
      venue: 'AMC Theaters',
    },
    likes: 24,
    comments: 3,
    isLiked: false,
  },
  {
    id: '2',
    user: {
      name: users['2'].name,
      avatar: users['2'].avatar || 'https://i.pravatar.cc/150?img=5',
      initials: users['2'].initials,
    },
    event: {
      title: 'Taylor Swift - The Eras Tour',
      type: 'concert' as const,
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1740',
      date: 'Yesterday at 8:00 PM',
      venue: 'Madison Square Garden',
    },
    likes: 156,
    comments: 42,
    isLiked: true,
  },
  {
    id: '3',
    user: {
      name: users['3'].name,
      avatar: users['3'].avatar || 'https://i.pravatar.cc/150?img=12',
      initials: users['3'].initials,
    },
    event: {
      title: 'Hamilton',
      type: 'musical' as const,
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1742',
      date: '2 days ago',
      venue: 'Richard Rodgers Theatre',
    },
    likes: 87,
    comments: 12,
    isLiked: false,
  },
  {
    id: '4',
    user: {
      name: users['4'].name,
      avatar: users['4'].avatar || 'https://i.pravatar.cc/150?img=9',
      initials: users['4'].initials,
    },
    event: {
      title: 'Hamlet',
      type: 'theater' as const,
      image: 'https://images.unsplash.com/photo-1588693273928-92fa26159c88?q=80&w=1635',
      date: 'Last week',
      venue: 'The Old Globe',
    },
    likes: 45,
    comments: 7,
    isLiked: false,
  },
];

export const Feed = () => {
  return (
    <div className="space-y-4 py-4">
      {dummyData.map((post) => (
        <TicketCard key={post.id} {...post} />
      ))}
    </div>
  );
};
