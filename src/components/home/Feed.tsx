
import { TicketCard } from './TicketCard';

const dummyData = [
  {
    id: '1',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      initials: 'AJ',
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
      name: 'Sarah Williams',
      avatar: 'https://i.pravatar.cc/150?img=5',
      initials: 'SW',
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
      name: 'Miguel Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=12',
      initials: 'MR',
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
      name: 'Emma Chen',
      avatar: 'https://i.pravatar.cc/150?img=9',
      initials: 'EC',
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
