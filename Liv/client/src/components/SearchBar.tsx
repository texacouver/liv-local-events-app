import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="px-4 py-4 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary transition-transform-smooth animate-pulse-soft" />
        <Input
          type="text"
          placeholder="Search events, deals, venues..."
          className="pl-12 bg-card border-0 focus:ring-2 focus:ring-primary rounded-full h-12 text-foreground placeholder:text-muted-foreground shadow-sm transition-all-smooth hover:shadow-md focus:shadow-lg hover-lift"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
