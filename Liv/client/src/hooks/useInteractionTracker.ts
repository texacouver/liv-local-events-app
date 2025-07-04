import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useGeolocation } from "@/hooks/useGeolocation";

export function useInteractionTracker() {
  const { location } = useGeolocation();

  const trackInteractionMutation = useMutation({
    mutationFn: async ({ listingId, action }: { listingId: number; action: string }) => {
      const deviceLocation = location ? {
        latitude: location.latitude,
        longitude: location.longitude
      } : null;

      await apiRequest("/api/interactions", "POST", {
        listingId,
        action,
        deviceLocation
      });
    },
    onError: (error) => {
      // Silently log interaction errors to avoid disrupting user experience
      console.warn("Failed to track interaction:", error);
    },
  });

  const trackInteraction = (listingId: number, action: "view" | "favorite" | "use_deal" | "share") => {
    trackInteractionMutation.mutate({ listingId, action });
  };

  return { trackInteraction };
}