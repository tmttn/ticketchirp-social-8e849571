
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '../ui/Logo';

export const UnauthenticatedView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-8">
        <Logo className="h-16 w-auto mb-4 mx-auto" />
        <h1 className="text-3xl font-bold">Welcome to TicketChirp</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Share your entertainment experiences and discover what others are enjoying
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join the Community</CardTitle>
          <CardDescription>
            Sign up or log in to start sharing your experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-md">
                <span className="text-2xl">🍿</span>
                <p className="mt-2 font-medium">Movies</p>
              </div>
              <div className="text-center p-4 border rounded-md">
                <span className="text-2xl">🎵</span>
                <p className="mt-2 font-medium">Concerts</p>
              </div>
              <div className="text-center p-4 border rounded-md">
                <span className="text-2xl">🎭</span>
                <p className="mt-2 font-medium">Theater</p>
              </div>
              <div className="text-center p-4 border rounded-md">
                <span className="text-2xl">🎻</span>
                <p className="mt-2 font-medium">Musicals</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={() => navigate('/auth')} 
            className="w-full gradient-bg hover:opacity-90"
          >
            Log In
          </Button>
          <Button 
            onClick={() => navigate('/auth?tab=signup')} 
            variant="outline"
            className="w-full"
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
