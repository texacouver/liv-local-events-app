import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";


export function Header() {
  const [city, setCity] = useState("Vancouver");
  const { location, error } = useGeolocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border animate-slide-up">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-[10px] mr-[10px] animate-pulse-soft">
              Liv
            </h1>
          </div>
          <div className="flex items-center space-x-3 bg-card px-3 py-2 rounded-full hover-scale btn-press transition-all-smooth">
            <MapPin className="h-4 w-4 text-primary animate-pulse-soft" />
            <span className="text-sm font-medium text-foreground">{city}</span>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent hover-scale">
              <ChevronDown className="h-4 w-4 text-primary transition-transform-smooth hover:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
