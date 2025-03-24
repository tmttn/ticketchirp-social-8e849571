
import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FollowTabContent } from "./FollowTabContent";
import { useFollowStats } from "@/hooks/useFollowStats";

export interface FollowStatsProps {
  userId: string;
  followingCount?: number;
  followersCount?: number;
}

export const FollowStats = ({ userId, followingCount: initialFollowingCount, followersCount: initialFollowersCount }: FollowStatsProps) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const { followingCount, followersCount } = useFollowStats(userId, initialFollowingCount, initialFollowersCount);
  
  const handleTabChange = (tab: 'followers' | 'following') => {
    setActiveTab(tab);
  };
  
  return (
    <div className="flex gap-4 text-sm">
      <Sheet onOpenChange={() => handleTabChange('followers')}>
        <SheetTrigger asChild>
          <Button 
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
              <FollowTabContent 
                userId={userId}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={() => handleTabChange('following')}>
        <SheetTrigger asChild>
          <Button 
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
              <FollowTabContent 
                userId={userId}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
