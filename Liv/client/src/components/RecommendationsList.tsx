import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Listing } from "@shared/schema";
import { Sparkles, RefreshCw, Heart, Eye, ExternalLink } from "lucide-react";

interface RecommendationsListProps {
  limit?: number;
  showHeader?: boolean;
}

export function RecommendationsList({ limit = 5, showHeader = true }: RecommendationsListProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: recommendations, isLoading, error, refetch } = useQuery<Listing[]>({
    queryKey: ["/api/recommendations", { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/recommendations?limit=${limit}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        throw new Error("Failed to fetch recommendations");
      }
      return response.json();
    },
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/recommendations/refresh", "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Recommendations Updated",
        description: "Your personalized recommendations have been refreshed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to refresh recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const trackInteractionMutation = useMutation({
    mutationFn: async ({ listingId, action }: { listingId: number; action: string }) => {
      await apiRequest("/api/interactions", "POST", { listingId, action });
    },
  });

  const handleViewListing = (listing: Listing) => {
    trackInteractionMutation.mutate({ listingId: listing.id, action: "view" });
    setLocation(`/detail/${listing.id}`);
  };

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

  if (error) {
    if ((error as Error).message === "Authentication required") {
      return (
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <AlertDescription>
            Please log in to see personalized recommendations.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <AlertDescription>
          Failed to load recommendations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse-soft" />
            <h2 className="text-xl font-bold text-foreground">Recommended for You</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            className="hover-scale btn-press"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="card-gradient border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !recommendations || recommendations.length === 0 ? (
        <Card className="card-gradient border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring venues and setting preferences to get personalized recommendations.
            </p>
            <Button
              onClick={() => setLocation("/profile")}
              className="primary-gradient text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Set Preferences
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recommendations.map((listing, index) => (
            <Card 
              key={listing.id} 
              className="card-gradient border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleViewListing(listing)}
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
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Top Pick
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{listing.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{listing.description}</p>
                    {listing.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-muted-foreground">⭐ {listing.rating}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{listing.priceRange}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      size="sm" 
                      className="primary-gradient text-primary-foreground hover:opacity-90 transition-opacity hover-scale btn-press"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}