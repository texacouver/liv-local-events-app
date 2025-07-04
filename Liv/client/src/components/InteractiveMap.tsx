import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Listing } from "@shared/schema";
import { parseCoordinate } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

interface InteractiveMapProps {
  listings: Listing[];
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
}

export function InteractiveMap({ 
  listings, 
  center = [49.2827, -123.1207], // Default to Vancouver downtown
  zoom = 13,
  height = "400px"
}: InteractiveMapProps) {
  const [, setLocation] = useLocation();

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

  const createCustomIcon = (type: string) => {
    const color = type === "Event" ? "#c084fc" : 
                 type === "Restaurant Deal" ? "#fb923c" : 
                 type === "Retail Deal" ? "#4ade80" : "#6b7280";
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5S12.5 41 12.5 41 25 19.4 25 12.5 19.4 0 12.5 0z" fill="${color}"/>
          <circle cx="12.5" cy="12.5" r="8" fill="white"/>
          <circle cx="12.5" cy="12.5" r="5" fill="${color}"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  const mapComponent = useMemo(() => (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: "12px" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[parseCoordinate(listing.latitude), parseCoordinate(listing.longitude)] as LatLngExpression}
          icon={createCustomIcon(listing.type)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={`${getCategoryColor(listing.type)} text-xs font-bold`}>
                  {listing.type.replace(" Deal", "")}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{listing.name}</h3>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {listing.description}
              </p>
              <Button 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setLocation(`/detail/${listing.id}`)}
              >
                View Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  ), [listings, center, zoom, height, setLocation]);

  return mapComponent;
}