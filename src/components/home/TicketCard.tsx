
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  event: {
    title: string;
    type: 'movie' | 'concert' | 'musical' | 'theater' | 'other';
    image: string;
    date: string;
    venue: string;
  };
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export const TicketCard = ({
  id,
  user,
  event,
  likes,
  comments,
  isLiked = false,
}: TicketCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'bg-blue-500';
      case 'concert':
        return 'bg-purple-500';
      case 'musical':
        return 'bg-pink-500';
      case 'theater':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full overflow-hidden animate-slide-up hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">checked in at {event.venue}</p>
            </div>
          </div>
          <Badge className={cn("capitalize", getEventTypeColor(event.type))}>
            {event.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
            <p className="text-sm opacity-90">{event.date}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex gap-1 px-2",
              liked && "text-red-500 hover:text-red-600"
            )}
            onClick={handleLike}
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1 px-2">
            <MessageCircle className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="px-2">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
