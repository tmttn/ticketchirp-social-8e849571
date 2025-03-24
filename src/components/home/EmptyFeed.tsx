
import React from 'react';

type EmptyFeedProps = {
  message: string;
};

export const EmptyFeed = ({ message }: EmptyFeedProps) => {
  return (
    <div className="py-8 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};
