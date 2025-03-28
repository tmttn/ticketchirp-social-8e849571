
import { Navbar } from "@/components/layout/Navbar";
import { Feed } from "@/components/home/Feed";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UnauthenticatedView } from "@/components/home/UnauthenticatedView";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Debug log to check auth state
  useEffect(() => {
    console.log('Home page rendered with auth state:', user ? 'Logged in' : 'Not logged in');
    if (user) {
      console.log('User ID:', user.id);
    }
  }, [user]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-md mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : user ? (
          <>
            <div className="py-6 sticky top-16 bg-background/95 backdrop-blur-sm z-10">
              <Tabs defaultValue="feed">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          
            <Tabs defaultValue="feed" className="space-y-4">
              <TabsContent value="feed" className="space-y-4 mt-0">
                <Feed />
              </TabsContent>
              
              <TabsContent value="discover" className="space-y-4 mt-0">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2">Discover New Experiences</h2>
                  <p className="text-muted-foreground mb-6">
                    Find popular events and see what others are enjoying
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => console.log('Movies')}
                    >
                      <span className="text-xl">🍿</span>
                      <span>Movies</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => console.log('Concerts')}
                    >
                      <span className="text-xl">🎵</span>
                      <span>Concerts</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => console.log('Theater')}
                    >
                      <span className="text-xl">🎭</span>
                      <span>Theater</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => console.log('Musicals')}
                    >
                      <span className="text-xl">🎻</span>
                      <span>Musicals</span>
                    </Button>
                  </div>
                  
                  <Button onClick={() => navigate('/scan')} className="gradient-bg hover:opacity-90">
                    Scan a Ticket Now
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="fixed bottom-6 right-6 md:hidden">
              <Button 
                onClick={() => navigate('/scan')} 
                size="lg"
                className="h-14 w-14 rounded-full gradient-bg hover:opacity-90 shadow-lg"
              >
                <Ticket className="h-6 w-6" />
              </Button>
            </div>
          </>
        ) : (
          <UnauthenticatedView />
        )}
      </main>
    </div>
  );
};

export default Home;
