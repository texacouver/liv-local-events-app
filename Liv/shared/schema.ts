import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Listings table for venues, restaurants, events
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "Restaurant Deal", "Event", "Retail Deal"
  city: varchar("city", { length: 100 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 7 }).notNull(),
  validUntil: varchar("valid_until", { length: 100 }).notNull(),
  qrCode: varchar("qr_code", { length: 500 }).notNull(),
  website: varchar("website", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  address: varchar("address", { length: 500 }),
  hours: text("hours"),
  tags: text("tags").array(),
  rating: numeric("rating", { precision: 2, scale: 1 }),
  priceRange: varchar("price_range", { length: 20 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  listingId: serial("listing_id").notNull().references(() => listings.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences for recommendation engine
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  preferredCategories: text("preferred_categories").array().default([]),
  preferredPriceRange: varchar("preferred_price_range", { length: 20 }),
  preferredTags: text("preferred_tags").array().default([]),
  maxDistance: numeric("max_distance", { precision: 4, scale: 1 }).default("10.0"), // km
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User interactions for tracking behavior
export const userInteractions = pgTable("user_interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  listingId: serial("listing_id").notNull().references(() => listings.id),
  action: varchar("action", { length: 50 }).notNull(), // "view", "favorite", "use_deal", "share"
  deviceLocation: jsonb("device_location"), // {latitude, longitude}
  timestamp: timestamp("timestamp").defaultNow(),
});

// Recommendation scores (cached for performance)
export const recommendationScores = pgTable("recommendation_scores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  listingId: serial("listing_id").notNull().references(() => listings.id),
  score: numeric("score", { precision: 5, scale: 3 }).notNull(),
  factors: jsonb("factors"), // breakdown of scoring factors
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserInteractionSchema = createInsertSchema(userInteractions).omit({
  id: true,
  timestamp: true,
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserInteraction = typeof userInteractions.$inferSelect;
export type InsertUserInteraction = z.infer<typeof insertUserInteractionSchema>;
export type RecommendationScore = typeof recommendationScores.$inferSelect;
