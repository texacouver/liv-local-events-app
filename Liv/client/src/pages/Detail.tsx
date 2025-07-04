import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InteractiveMap } from "@/components/InteractiveMap";
import { ArrowLeft, MapPin, Clock, Heart } from "lucide-react";
import { Listing } from "@shared/schema";
import { parseCoordinate } from "@/lib/utils";

export function Detail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: listing, isLoading, error } = useQuery<Listing>({
    queryKey: ["/api/listings", id],
    queryFn: async () => {
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) throw new Error("Failed to fetch listing");
      return response.json();
    },
  });

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

  const handleUseDeal = () => {
    setLocation(`/qr/${id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert>
          <AlertDescription>
            Failed to load listing details. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="space-y-4">
          <Skeleton className="w-full h-64 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert>
          <AlertDescription>
            Listing not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold truncate">{listing.name}</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="relative">
          <img 
            src={listing.imageUrl} 
            alt={listing.name}
            className="w-full h-64 object-cover rounded-xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
            }}
          />
          <div className="absolute top-4 left-4">
            <span className={`px-2 py-1 ${getCategoryColor(listing.type)} text-white text-xs rounded-full font-medium`}>
              {listing.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">{listing.name}</h2>
            <p className="text-muted-foreground">{listing.description}</p>
          </div>

          <Card className="animate-fade-in animate-stagger-1">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 text-primary animate-pulse-soft" />
                <span>{listing.city}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 text-primary animate-pulse-soft" />
                <span>Valid until {formatValidUntil(listing.validUntil)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-card rounded-xl p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Location
            </h3>
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <InteractiveMap 
                listings={[listing]} 
                center={[parseCoordinate(listing.latitude), parseCoordinate(listing.longitude)]}
                zoom={15}
                height="192px"
              />
            </div>
          </div>

          <div className="space-y-3 animate-fade-in animate-stagger-3">
            <Button 
              className="w-full primary-gradient text-primary-foreground hover:opacity-90 transition-opacity font-semibold text-lg py-6 glow-primary hover-scale btn-press"
              size="lg"
              onClick={handleUseDeal}
            >
              {listing.type === "Event" ? "🎉 Join Event" : "✨ Use Deal"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-border hover:bg-card/50 font-medium py-6 hover-scale btn-press"
              size="lg"
            >
              <Heart className="h-5 w-5 mr-2 text-primary transition-transform-smooth hover:scale-110" />
              Add to Favorites
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
