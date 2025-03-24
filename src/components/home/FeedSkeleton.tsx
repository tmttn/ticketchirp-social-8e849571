
import { Skeleton } from '@/components/ui/skeleton';

export const FeedSkeleton = () => {
  return (
    <div className="space-y-4 py-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full rounded-lg border border-gray-200 shadow">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32 mt-1" />
              </div>
            </div>
          </div>
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-5 w-36 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
