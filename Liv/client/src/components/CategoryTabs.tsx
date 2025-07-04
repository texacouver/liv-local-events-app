import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const categories = [
    { id: "all", label: "All", icon: "🌟", color: "primary-gradient" },
    { id: "events", label: "Events Tonight", icon: "🎉", color: "bg-event" },
    { id: "restaurants", label: "Restaurant Deals", icon: "🍕", color: "bg-restaurant" },
    { id: "retail", label: "Retail Deals", icon: "🛍️", color: "bg-retail" },
  ];

  return (
    <div className="px-4 mb-6">
      <ScrollArea className="w-full">
        <div className="flex space-x-3 pb-2">
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              className={`whitespace-nowrap transition-all duration-300 px-4 py-2 rounded-full font-semibold hover-scale btn-press animate-fade-in ${
                index === 0 ? 'animate-stagger-1' : 
                index === 1 ? 'animate-stagger-2' : 
                index === 2 ? 'animate-stagger-3' : 'animate-stagger-4'
              } ${
                activeCategory === category.id
                  ? `${category.color} text-white shadow-lg hover:opacity-90 animate-bounce-soft`
                  : "bg-card text-muted-foreground hover:bg-card/80 hover:text-foreground"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="mr-2 text-sm animate-wiggle">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
