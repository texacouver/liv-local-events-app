import { Listing } from "@shared/schema";

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface ListingWithDistance extends Listing {
  distance?: number;
}

export type CategoryType = "all" | "events" | "restaurants" | "retail";
