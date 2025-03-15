
import { useState } from 'react';
import { Camera, Ticket, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const ScanTicket = () => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  
  const startScanning = async () => {
    // In a real app, you would implement actual QR/barcode scanner here
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
      
      // Simulate scanning for demo purposes
      setTimeout(() => {
        setScanning(false);
        toast({
          title: "Ticket Scanned!",
          description: "Movie: Dune Part 2 - IMAX at AMC Theaters",
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <Camera className="w-16 h-16 text-brand-purple animate-pulse-subtle" />
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-brand-purple rounded-md animate-pulse"></div>
                  </div>
                  <p className="font-medium">Scanning...</p>
                  <p className="text-sm text-muted-foreground">Position the code within the frame</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 rounded-full bg-white/90 z-10"
                onClick={() => setScanning(false)}
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
                  disabled={!hasCamera}
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
          <p className="text-sm text-muted-foreground w-full text-center">
            Or manually enter your ticket code
          </p>
          <Button variant="outline" className="w-full">
            Enter Code Manually
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
