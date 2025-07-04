import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserPreferences } from "@shared/schema";
import { Settings, MapPin, DollarSign, Tag } from "lucide-react";

interface PreferencesSetupProps {
  onComplete?: () => void;
  showTitle?: boolean;
}

export function PreferencesSetup({ onComplete, showTitle = true }: PreferencesSetupProps) {
  const { toast } = useToast();

  const [preferences, setPreferences] = useState({
    preferredCategories: [] as string[],
    preferredPriceRange: "",
    preferredTags: [] as string[],
    maxDistance: 10.0,
  });

  const { data: existingPreferences } = useQuery<UserPreferences | null>({
    queryKey: ["/api/preferences"],
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: typeof preferences) => {
      await apiRequest("/api/preferences", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Preferences Updated",
        description: "Your recommendations will be personalized based on your preferences.",
      });
      onComplete?.();
    },
    onError: (error) => {
      console.error("Preferences update error:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (existingPreferences) {
      setPreferences({
        preferredCategories: existingPreferences.preferredCategories || [],
        preferredPriceRange: existingPreferences.preferredPriceRange || "",
        preferredTags: existingPreferences.preferredTags || [],
        maxDistance: parseFloat(existingPreferences.maxDistance?.toString() || "10.0"),
      });
    }
  }, [existingPreferences]);

  const categories = [
    { id: "Event", label: "Events", icon: "🎉", color: "bg-event" },
    { id: "Restaurant Deal", label: "Restaurant Deals", icon: "🍕", color: "bg-restaurant" },
    { id: "Retail Deal", label: "Retail Deals", icon: "🛍️", color: "bg-retail" },
  ];

  const priceRanges = [
    { id: "$", label: "Budget-Friendly", icon: "💰" },
    { id: "$$", label: "Moderate", icon: "💰💰" },
    { id: "$$$", label: "Premium", icon: "💰💰💰" },
    { id: "$$$$", label: "Luxury", icon: "💰💰💰💰" },
  ];

  const availableTags = [
    "seafood", "cocktails", "patio", "view", "live music", "concerts", "entertainment",
    "historic", "family", "education", "interactive", "science", "craft beer", "brewery",
    "tours", "local", "fashion", "luxury", "shopping", "department", "women's fashion",
    "canadian", "trendy", "designer", "coffee", "breakfast", "quick", "theatre",
    "performing arts", "musicals", "cultural", "athletic wear", "yoga", "premium",
    "scenic", "outdoor", "mountains", "adventure"
  ];

  const toggleCategory = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(categoryId)
        ? prev.preferredCategories.filter(id => id !== categoryId)
        : [...prev.preferredCategories, categoryId]
    }));
  };

  const toggleTag = (tag: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredTags: prev.preferredTags.includes(tag)
        ? prev.preferredTags.filter(t => t !== tag)
        : [...prev.preferredTags, tag]
    }));
  };

  const handleSubmit = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  return (
    <Card className="card-gradient border-0 shadow-lg">
      <CardHeader>
        {showTitle && (
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Settings className="h-6 w-6 text-primary animate-pulse-soft" />
            <span>Personalize Your Experience</span>
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">What interests you most?</Label>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover-scale ${
                  preferences.preferredCategories.includes(category.id)
                    ? `${category.color} text-white border-transparent`
                    : "bg-card border-border hover:border-primary/20"
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                <Checkbox
                  checked={preferences.preferredCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="pointer-events-none"
                />
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">Preferred Price Range</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {priceRanges.map((range) => (
              <div
                key={range.id}
                className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover-scale ${
                  preferences.preferredPriceRange === range.id
                    ? "primary-gradient text-primary-foreground border-transparent"
                    : "bg-card border-border hover:border-primary/20"
                }`}
                onClick={() => setPreferences(prev => ({ ...prev, preferredPriceRange: range.id }))}
              >
                <span className="text-lg">{range.icon}</span>
                <span className="font-medium">{range.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Max Distance */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">
              Maximum Distance: {preferences.maxDistance} km
            </Label>
          </div>
          <Slider
            value={[preferences.maxDistance]}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, maxDistance: value[0] }))}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Interest Tags */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Your Interests</Label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={preferences.preferredTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 hover-scale ${
                  preferences.preferredTags.includes(tag)
                    ? "primary-gradient text-primary-foreground"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={updatePreferencesMutation.isPending}
          className="w-full primary-gradient text-primary-foreground hover:opacity-90 transition-opacity font-semibold py-3 hover-scale btn-press"
        >
          {updatePreferencesMutation.isPending ? "Updating..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}