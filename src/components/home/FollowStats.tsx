
import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, getFollowers, getFollowing } from "@/utils/userUtils";
import { FollowButton } from "./FollowButton";

interface FollowStatsProps {
  userId: string;
  followingCount: number;
  followersCount: number;
}

export const FollowStats = ({ userId, followingCount, followersCount }: FollowStatsProps) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  
  return (
    <div className="flex gap-4 text-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => setActiveTab('followers')} 
            variant="ghost" 
            className="px-2 h-auto"
          >
            <span className="font-bold">{followersCount}</span> 
            <span className="text-muted-foreground ml-1">followers</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80%] sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>
              <div className="flex gap-4 border-b pb-4">
                <Button 
                  variant={activeTab === 'followers' ? "default" : "ghost"}
                  onClick={() => setActiveTab('followers')}
                >
                  Followers
                </Button>
                <Button 
                  variant={activeTab === 'following' ? "default" : "ghost"}
                  onClick={() => setActiveTab('following')}
                >
                  Following
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto h-[calc(100%-80px)]">
            <UserList 
              users={activeTab === 'followers' ? getFollowers(userId) : getFollowing(userId)} 
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button 
            onClick={() => setActiveTab('following')} 
            variant="ghost" 
            className="px-2 h-auto"
          >
            <span className="font-bold">{followingCount}</span> 
            <span className="text-muted-foreground ml-1">following</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80%] sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>
              <div className="flex gap-4 border-b pb-4">
                <Button 
                  variant={activeTab === 'followers' ? "default" : "ghost"}
                  onClick={() => setActiveTab('followers')}
                >
                  Followers
                </Button>
                <Button 
                  variant={activeTab === 'following' ? "default" : "ghost"}
                  onClick={() => setActiveTab('following')}
                >
                  Following
                </Button>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto h-[calc(100%-80px)]">
            <UserList 
              users={activeTab === 'followers' ? getFollowers(userId) : getFollowing(userId)} 
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.followersCount} followers
              </p>
            </div>
          </div>
          <FollowButton userId={user.id} />
        </div>
      ))}
    </div>
  );
};
