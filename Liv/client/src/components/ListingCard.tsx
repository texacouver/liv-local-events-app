import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { Listing } from "@shared/schema";

interface ListingCardProps {
  listing: Listing & { distance?: number };
}

export function ListingCard({ listing }: ListingCardProps) {
  const [, setLocation] = useLocation();

  const formatValidUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      })}`;
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "Event":
        return "bg-event text-white glow-event";
      case "Restaurant Deal":
        return "bg-restaurant text-white glow-restaurant";
      case "Retail Deal":
        return "bg-retail text-white glow-retail";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} km away`;
  };

  return (
    <Card className="card-gradient overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover-lift btn-press animate-fade-in">
      <div className="relative">
        <img 
          src={listing.imageUrl} 
          alt={listing.name}
          className="w-full h-48 object-cover transition-transform-smooth group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex items-center justify-between w-[calc(100%-2rem)]">
          <Badge className={`${getCategoryColor(listing.type)} border-0 font-bold px-3 py-1 text-xs`}>
            {listing.type.toUpperCase()}
          </Badge>
          {listing.distance && (
            <span className="text-white text-sm bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
              {formatDistance(listing.distance)}
            </span>
          )}
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-2 text-foreground">{listing.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>Valid until {formatValidUntil(listing.validUntil).split(" at ")[1] || formatValidUntil(listing.validUntil)}</span>
          </div>
          <Button 
            className="primary-gradient text-primary-foreground hover:opacity-90 transition-opacity font-semibold px-6 hover-scale btn-press"
            size="sm"
            onClick={() => setLocation(`/detail/${listing.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
