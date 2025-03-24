
import { useState, useRef, useEffect } from 'react';
import { Camera, Ticket, X, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const ScanTicket = () => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to scan tickets",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);
  
  const addTicketMutation = useMutation({
    mutationFn: async ({ title, venue, eventType, eventDate, imageUrl }: {
      title: string;
      venue: string;
      eventType: string;
      eventDate: string;
      imageUrl?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ticket_posts')
        .insert([
          {
            user_id: user.id,
            title,
            venue,
            event_type: eventType,
            event_date: eventDate,
            image_url: imageUrl || 'https://via.placeholder.com/400x300',
            content: `Checked in at ${venue}`
          }
        ])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
      
      toast({
        title: "Ticket added successfully!",
        description: "Your ticket has been added to your collection",
      });
      
      // Navigate to the tickets page
      navigate('/tickets');
    },
    onError: (error) => {
      console.error('Error adding ticket:', error);
      toast({
        title: "Failed to add ticket",
        description: "There was an error adding your ticket",
        variant: "destructive",
      });
    }
  });
  
  const startScanning = async () => {
    try {
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');
      
      if (!hasVideoInput) {
        setHasCamera(false);
        toast({
          title: "No camera detected",
          description: "Your device doesn't have a camera or permission was denied.",
          variant: "destructive",
        });
        return;
      }
      
      setScanning(true);
      
      // Access camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
      
      // In a real app, you would implement a barcode scanner library here
      // For this demo, we'll simulate finding a QR code after 3 seconds
      setTimeout(() => {
        // Simulate successful scan
        processScannedTicket({
          title: "Dune Part 2 - IMAX",
          venue: "AMC Theaters",
          eventType: "movie",
          eventDate: new Date().toISOString(),
        });
      }, 3000);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCamera(false);
      toast({
        title: "Camera access error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopScanning = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setScanning(false);
  };
  
  const processScannedTicket = (ticketData: {
    title: string;
    venue: string;
    eventType: string;
    eventDate: string;
    imageUrl?: string;
  }) => {
    stopScanning();
    
    // Add the ticket to the database
    addTicketMutation.mutate(ticketData);
  };
  
  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      toast({
        title: "Code required",
        description: "Please enter a valid ticket code",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would validate the ticket code
    // For this demo, we'll use a simple example
    if (manualCode === 'DUNE123' || manualCode.length > 5) {
      processScannedTicket({
        title: "Manually Entered Ticket",
        venue: "Venue from code " + manualCode,
        eventType: "other",
        eventDate: new Date().toISOString(),
      });
    } else {
      toast({
        title: "Invalid code",
        description: "The ticket code you entered is invalid",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-brand-purple" />
            Scan Your Ticket
          </CardTitle>
          <CardDescription>
            Scan a QR code or barcode on your ticket to check in to an event
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scanning ? (
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-dashed border-brand-purple">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64 border-2 border-white/50 rounded-lg">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 rounded-full bg-white/90 z-10"
                onClick={stopScanning}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="aspect-square w-full rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
              <div className="text-center px-4">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-1">Ready to Scan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tap the button below to start scanning your ticket
                </p>
                <Button 
                  onClick={startScanning}
                  disabled={!hasCamera || addTicketMutation.isPending}
                  className="gradient-bg hover:opacity-90"
                >
                  Start Camera
                </Button>
                {!hasCamera && (
                  <p className="text-xs text-destructive mt-2">
                    No camera available. Please check your device.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {showManualEntry ? (
            <form onSubmit={handleManualCodeSubmit} className="w-full space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter ticket code" 
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  disabled={addTicketMutation.isPending}
                />
                <Button 
                  type="submit" 
                  variant="default"
                  disabled={addTicketMutation.isPending}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowManualEntry(false)}
                disabled={addTicketMutation.isPending}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <p className="text-sm text-muted-foreground w-full text-center">
                Or manually enter your ticket code
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowManualEntry(true)}
                disabled={addTicketMutation.isPending}
              >
                Enter Code Manually
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
