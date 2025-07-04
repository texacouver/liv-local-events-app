import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ListingCard } from "@/components/ListingCard";
import { RecommendationsList } from "@/components/RecommendationsList";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useInteractionTracker } from "@/hooks/useInteractionTracker";
import { calculateDistance, parseCoordinate } from "@/lib/utils";
import { Listing } from "@shared/schema";

export function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { location } = useGeolocation();

  const { data: listings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const { data: searchResults, isLoading: isSearching } = useQuery<Listing[]>({
    queryKey: ["/api/listings/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/listings/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredListings = () => {
    let data = searchQuery.trim() ? searchResults : listings;
    if (!data) return [];

    // Filter by category
    if (activeCategory !== "all") {
      const categoryMap: { [key: string]: string } = {
        "events": "Event",
        "restaurants": "Restaurant Deal",
        "retail": "Retail Deal"
      };
      data = data.filter(listing => listing.type === categoryMap[activeCategory]);
    }

    // Add distance if location is available
    if (location) {
      data = data.map(listing => ({
        ...listing,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          parseCoordinate(listing.latitude),
          parseCoordinate(listing.longitude)
        )
      }));
    }

    return data;
  };

  const displayListings = filteredListings();

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="px-4 py-8">
          <Alert>
            <AlertDescription>
              Failed to load listings. Please check your internet connection and try again.
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
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      
      <div className="px-4 pb-20">
        {/* Personalized Recommendations */}
        {!searchQuery && (
          <div className="mb-6">
            <RecommendationsList limit={3} />
          </div>
        )}

        {isLoading || isSearching ? (
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
        ) : displayListings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No listings found matching your search." : "No listings available."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayListings.map((listing, index) => (
              <div key={listing.id} className={`animate-fade-in ${
                index === 0 ? 'animate-stagger-1' : 
                index === 1 ? 'animate-stagger-2' : 
                index === 2 ? 'animate-stagger-3' : 'animate-stagger-4'
              }`}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}
