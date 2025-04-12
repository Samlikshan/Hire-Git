import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="space-y-6 text-center max-w-md">
        <h1 className="text-6xl font-bold tracking-tighter">404</h1>
        <h2 className="text-2xl font-medium">Page not found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            variant="default"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <Home size={16} />
            Back to home
          </Button>
          <Button variant="outline">Report issue</Button>
        </div>
      </div>
      <div className="mt-12 border-t border-border w-full max-w-md pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <a href="#" className="font-medium underline underline-offset-4">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
