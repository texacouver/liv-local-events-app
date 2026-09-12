import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { parseCoordinate } from "@/lib/utils";
import { Listing } from "@shared/schema";
import { Home as HomeIcon, Search, Heart, Map as MapIcon, User, MapPin, SlidersHorizontal, Sparkles, Clock3, Navigation, CircleDollarSign, Share2 } from "lucide-react";

const categories = [{ id: "all", label: "For You" }, { id: "events", label: "Music & Events" }, { id: "restaurants", label: "Food & Drinks" }, { id: "retail", label: "Local Offers" }];
function distanceBetween(a: number, b: number, c: number, d: number) { const r = 6371, y = (c - a) * Math.PI / 180, x = (d - b) * Math.PI / 180; const q = Math.sin(y / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(x / 2) ** 2; return r * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q)); }
function formatTime(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }

export function Home() {
  const [activeCategory, setActiveCategory] = useState("all"); const [searchQuery, setSearchQuery] = useState(""); const [location, setLocation] = useLocation(); const { location: deviceLocation } = useGeolocation();
  const { data: listings, isLoading, error } = useQuery<Listing[]>({ queryKey: ["/api/listings"] });
  const { data: searchResults, isLoading: isSearching } = useQuery<Listing[]>({ queryKey: ["/api/listings/search", searchQuery], queryFn: async () => { const response = await fetch(`/api/listings/search?q=${encodeURIComponent(searchQuery)}`); if (!response.ok) throw new Error("Search failed"); return response.json(); }, enabled: Boolean(searchQuery.trim()) });
  const source = searchQuery.trim() ? searchResults : listings;
  const visible = (source || []).filter((listing) => activeCategory === "all" || listing.type === (activeCategory === "events" ? "Event" : activeCategory === "restaurants" ? "Restaurant Deal" : "Retail Deal")).map((listing) => ({ ...listing, distance: deviceLocation ? distanceBetween(deviceLocation.latitude, deviceLocation.longitude, parseCoordinate(listing.latitude), parseCoordinate(listing.longitude)) : undefined }));
  const navItems = [{ label: "Home", icon: HomeIcon, path: "/" }, { label: "Search", icon: Search, path: "#search" }, { label: "Saved", icon: Heart, path: "/favorites" }, { label: "Map", icon: MapIcon, path: "/map" }, { label: "Profile", icon: User, path: "/profile" }];
  const go = (path: string) => path.startsWith("#") ? document.getElementById("search")?.focus() : setLocation(path);
  return <div className="vision-shell">
    <aside className="vision-sidebar vision-window" aria-label="Quick navigation">{navItems.slice(0, 4).map(({ label, icon: Icon, path }) => <button key={label} className={location === path ? "active" : ""} aria-label={label} onClick={() => go(path)}><Icon strokeWidth={1.5} /></button>)}</aside>
    <main className="vision-main">
      <header className="vision-header"><div><div className="vision-eyebrow">Friday evening · Vancouver</div><div className="vision-logo">Liv</div></div><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} strokeWidth={1.5} /><input id="search" className="vision-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search places, events..." aria-label="Search places and events" /></div></header>
      <section className="vision-window vision-feed"><div className="vision-feed-header"><div><h1 className="vision-title">Good evening, Michael.</h1><p className="vision-subtitle">Here’s what’s worth doing tonight.</p></div><button className="vision-control rounded-full p-3" aria-label="Adjust preferences"><SlidersHorizontal size={18} strokeWidth={1.5} /></button></div>
        <div className="vision-tabs vision-inner scrollbar-hide" role="tablist" aria-label="Categories">{categories.map((category) => <button key={category.id} role="tab" aria-selected={activeCategory === category.id} className={`vision-tab ${activeCategory === category.id ? "active" : ""}`} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}</div>
        {error && <Alert><AlertDescription>Unable to load listings right now.</AlertDescription></Alert>}
        {isLoading || isSearching ? <div className="vision-card-grid">{[1, 2, 3].map((item) => <div className="vision-card p-4" key={item}><Skeleton className="h-44 w-full rounded-2xl bg-white/10" /><Skeleton className="mt-4 h-5 w-3/4 bg-white/10" /><Skeleton className="mt-3 h-4 w-1/2 bg-white/10" /></div>)}</div> : <div className="vision-card-grid">{visible.slice(0, 6).map((listing, index) => <article className="vision-card" key={listing.id} onClick={() => go(`/detail/${listing.id}`)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && go(`/detail/${listing.id}`)}><div className="relative"><img className="vision-card-image" src={listing.imageUrl} alt={listing.name} /><span className="absolute left-3 top-3 vision-tag bg-black/50 text-white">{index === 0 ? <><Sparkles size={12} className="mr-1" /> Top pick</> : listing.type.replace(" Deal", "")}</span><button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white" aria-label={`Save ${listing.name}`} onClick={(event) => event.stopPropagation()}><Heart size={16} strokeWidth={1.5} /></button></div><div className="vision-card-body"><h2 className="vision-card-title">{listing.name}</h2><p className="vision-meta mt-1">{listing.city} · {listing.priceRange || "Local favourite"}</p><div className="mt-4 flex flex-wrap gap-2"><span className="vision-tag"><Clock3 size={12} className="mr-1" />{formatTime(listing.validUntil)}</span>{listing.distance !== undefined && <span className="vision-tag"><Navigation size={12} className="mr-1" />{listing.distance.toFixed(1)} km</span>}<span className="vision-tag"><CircleDollarSign size={12} className="mr-1" />{listing.priceRange || "$$"}</span></div><p className="vision-rationale mt-4"><Sparkles size={13} className="mr-1 inline" />Because this fits your interests</p></div></article>)}</div>}
        {!isLoading && !isSearching && visible.length === 0 && <div className="py-16 text-center text-white/50">No places found. Try another search.</div>}
      </section><div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-2 text-sm text-white/50"><span><MapPin size={14} className="mr-1 inline" /> Vancouver · personalized for you</span><span><Share2 size={14} className="mr-1 inline" /> Recommendations are made to share</span></div>
    </main>
    <nav className="vision-bottom vision-window" aria-label="Primary navigation">{navItems.map(({ label, icon: Icon, path }) => <button key={label} className={location === path ? "active" : ""} onClick={() => go(path)}><Icon strokeWidth={1.5} /><span>{label}</span></button>)}</nav>
  </div>;
}
