import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, QrCode } from "lucide-react";
import { Listing } from "@shared/schema";

export function QRCode() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const { data: listing, isLoading, error } = useQuery<Listing>({
    queryKey: ["/api/listings", id],
    queryFn: async () => {
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) throw new Error("Failed to fetch listing");
      return response.json();
    },
  });

  useEffect(() => {
    if (!listing) return;

    const updateCountdown = () => {
      const now = new Date();
      const validUntil = new Date(listing.validUntil);
      const diff = validUntil.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [listing]);

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => setLocation(`/detail/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert>
          <AlertDescription>
            Failed to load QR code. Please try again.
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
          onClick={() => setLocation(`/detail/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Skeleton className="w-48 h-48 rounded-xl mx-auto" />
            <Skeleton className="h-8 w-32 mx-auto" />
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
          onClick={() => setLocation(`/detail/${id}`)}
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
            onClick={() => setLocation(`/detail/${id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Liv Pass</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-sm card-gradient border-0 shadow-2xl">
          <CardContent className="p-8 text-center space-y-8">
            <div className="space-y-3">
              <div className="w-16 h-16 primary-gradient rounded-full flex items-center justify-center mx-auto glow-primary">
                <span className="text-primary-foreground font-bold text-2xl">🎫</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Liv Pass
              </h2>
              <p className="text-muted-foreground text-sm">Show this at checkout</p>
            </div>
            
            <div className="w-52 h-52 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-xl p-4">
              <div className="text-center">
                <QrCode className="h-20 w-20 text-background mx-auto mb-4" />
                <p className="text-sm text-background font-bold tracking-wider">{listing.qrCode}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Valid for</p>
              <div className={`text-3xl font-bold ${timeRemaining === "Expired" ? "text-red-500" : "text-primary glow-primary"}`}>
                {timeRemaining}
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full primary-gradient text-primary-foreground hover:opacity-90 transition-opacity font-semibold py-6 text-lg glow-primary"
                onClick={() => {
                  // Keep the QR code open
                }}
              >
                ✨ Keep Open
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-border hover:bg-card/50 font-medium py-4"
                onClick={() => setLocation("/")}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
