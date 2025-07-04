import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Heart, Map, User } from "lucide-react";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border animate-slide-up">
      <div className="flex justify-around py-4">
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 transition-all duration-300 hover-scale btn-press hover:bg-transparent ${
            isActive("/") 
              ? "text-primary bg-primary/10 rounded-xl px-4 py-2 animate-bounce-soft" 
              : "text-muted-foreground hover:text-primary"
          }`}
          onClick={() => setLocation("/")}
        >
          <Home className={`h-5 w-5 transition-transform-smooth ${isActive("/") ? "text-primary scale-110" : ""}`} />
          <span className={`text-xs font-medium ${isActive("/") ? "text-primary" : ""}`}>Home</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 transition-all duration-300 hover-scale btn-press hover:bg-transparent ${
            isActive("/favorites") 
              ? "text-primary bg-primary/10 rounded-xl px-4 py-2 animate-bounce-soft" 
              : "text-muted-foreground hover:text-primary rounded-xl px-4 py-2"
          }`}
          onClick={() => setLocation("/favorites")}
        >
          <Heart className={`h-5 w-5 transition-transform-smooth ${isActive("/favorites") ? "text-primary scale-110" : ""}`} />
          <span className={`text-xs font-medium ${isActive("/favorites") ? "text-primary" : ""}`}>Favorites</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 transition-all duration-300 hover-scale btn-press hover:bg-transparent ${
            isActive("/map") 
              ? "text-primary bg-primary/10 rounded-xl px-4 py-2 animate-bounce-soft" 
              : "text-muted-foreground hover:text-primary rounded-xl px-4 py-2"
          }`}
          onClick={() => setLocation("/map")}
        >
          <Map className={`h-5 w-5 transition-transform-smooth ${isActive("/map") ? "text-primary scale-110" : ""}`} />
          <span className={`text-xs font-medium ${isActive("/map") ? "text-primary" : ""}`}>Map</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center space-y-1 transition-all duration-300 hover-scale btn-press hover:bg-transparent ${
            isActive("/profile") 
              ? "text-primary bg-primary/10 rounded-xl px-4 py-2 animate-bounce-soft" 
              : "text-muted-foreground hover:text-primary rounded-xl px-4 py-2"
          }`}
          onClick={() => setLocation("/profile")}
        >
          <User className={`h-5 w-5 transition-transform-smooth ${isActive("/profile") ? "text-primary scale-110" : ""}`} />
          <span className={`text-xs font-medium ${isActive("/profile") ? "text-primary" : ""}`}>Profile</span>
        </Button>
      </div>
    </nav>
  );
}
