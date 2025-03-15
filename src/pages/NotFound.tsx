
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple/5 to-brand-teal/5 p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full gradient-bg flex items-center justify-center">
            <Ticket className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl mb-8">Oops! This ticket doesn't exist</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for can't be found. It might have been moved, deleted, or never existed.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="gradient-bg hover:opacity-90 transition-opacity"
          size="lg"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
