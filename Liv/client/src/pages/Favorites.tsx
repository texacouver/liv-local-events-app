import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { Listing } from "@shared/schema";

export function Favorites() {
  // Mock favorites data - in a real app this would come from user preferences/backend
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 3, 4]);
  
  const { data: allListings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const favoriteListings = allListings?.filter(listing => favoriteIds.includes(listing.id)) || [];

  const toggleFavorite = (listingId: number) => {
    setFavoriteIds(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="px-4 py-8">
          <Alert>
            <AlertDescription>
              Failed to load favorites. Please check your internet connection and try again.
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
          <h1 className="text-2xl font-bold text-foreground">Your Favorites</h1>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="text-sm font-medium">{favoriteListings.length} saved</span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favoriteListings.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Start exploring and tap the heart icon on listings you love to save them here.
            </p>
            <Button 
              className="primary-gradient text-primary-foreground hover:opacity-90 transition-opacity font-semibold"
              onClick={() => window.history.back()}
            >
              Discover Events & Deals
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {favoriteListings.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full p-2"
                  onClick={() => toggleFavorite(listing.id)}
                >
                  <HeartOff className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}