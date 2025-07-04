import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Navigation, Filter } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance, parseCoordinate } from "@/lib/utils";
import { Listing } from "@shared/schema";
import { useLocation } from "wouter";

export function Map() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { location: userLocation } = useGeolocation();
  
  const { data: listings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    
    let filtered = listings;
    
    // Filter by category
    if (selectedCategory !== "all") {
      const categoryMap: { [key: string]: string } = {
        "events": "Event",
        "restaurants": "Restaurant Deal",
        "retail": "Retail Deal"
      };
      filtered = filtered.filter(listing => listing.type === categoryMap[selectedCategory]);
    }
    
    // Add distance and sort by proximity
    if (userLocation) {
      filtered = filtered.map(listing => ({
        ...listing,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseCoordinate(listing.latitude),
          parseCoordinate(listing.longitude)
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    return filtered;
  }, [listings, selectedCategory, userLocation]);

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "Event":
        return "bg-event text-white";
      case "Restaurant Deal":
        return "bg-restaurant text-white";
      case "Retail Deal":
        return "bg-retail text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const categories = [
    { id: "all", label: "All", icon: "🌟" },
    { id: "events", label: "Events", icon: "🎉" },
    { id: "restaurants", label: "Food", icon: "🍕" },
    { id: "retail", label: "Shopping", icon: "🛍️" },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="px-4 py-8">
          <Alert>
            <AlertDescription>
              Failed to load map data. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Nearby</h1>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Navigation className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              {userLocation ? "Location enabled" : "Enable location"}
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              className={`whitespace-nowrap transition-all duration-300 px-4 py-2 rounded-full font-semibold ${
                selectedCategory === category.id
                  ? "primary-gradient text-primary-foreground shadow-lg"
                  : "bg-card text-muted-foreground hover:bg-card/80 hover:text-foreground"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-2 text-sm">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Interactive Map */}
        <Card className="card-gradient border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="w-full h-80 rounded-xl overflow-hidden">
              {isLoading ? (
                <Skeleton className="w-full h-full rounded-xl" />
              ) : (
                <InteractiveMap 
                  listings={filteredListings} 
                  center={userLocation ? [userLocation.latitude, userLocation.longitude] : [49.2827, -123.1207]}
                  zoom={13}
                  height="320px"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Listings */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 bg-card rounded-xl p-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No listings found for this category.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {filteredListings.length} nearby {selectedCategory === "all" ? "listings" : categories.find(c => c.id === selectedCategory)?.label.toLowerCase()}
            </h2>
            {filteredListings.map((listing) => (
              <Card 
                key={listing.id} 
                className="card-gradient border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => setLocation(`/detail/${listing.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.name}
                      className="w-16 h-16 object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={`${getCategoryColor(listing.type)} text-xs font-bold`}>
                          {listing.type.replace(" Deal", "")}
                        </Badge>
                        {(listing as any).distance && (
                          <span className="text-xs text-muted-foreground">
                            {((listing as any).distance as number).toFixed(1)} km
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{listing.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{listing.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="primary-gradient text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}