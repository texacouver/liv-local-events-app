import { 
  InsertListing, 
  Listing, 
  User, 
  UpsertUser, 
  UserPreferences,
  InsertUserPreferences,
  UserInteraction,
  InsertUserInteraction,
  RecommendationScore,
  listings, 
  users,
  userPreferences,
  userInteractions,
  recommendationScores
} from "@shared/schema";
import { db } from "./db";
import { eq, like, ilike, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  getListings(): Promise<Listing[]>;
  getListingById(id: number): Promise<Listing | null>;
  getListingsByType(type: string): Promise<Listing[]>;
  searchListings(query: string): Promise<Listing[]>;
  addListing(listing: InsertListing): Promise<Listing>;
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Recommendation engine operations
  getUserPreferences(userId: string): Promise<UserPreferences | null>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  trackUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction>;
  getUserInteractions(userId: string, limit?: number): Promise<UserInteraction[]>;
  getRecommendationsForUser(userId: string, limit?: number): Promise<Listing[]>;
  calculateRecommendationScores(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getListings(): Promise<Listing[]> {
    const result = await db.select().from(listings);
    return result;
  }

  async getListingById(id: number): Promise<Listing | null> {
    const result = await db.select().from(listings).where(eq(listings.id, id));
    return result[0] || null;
  }

  async getListingsByType(type: string): Promise<Listing[]> {
    const result = await db.select().from(listings)
      .where(eq(listings.type, type));
    return result;
  }

  async searchListings(query: string): Promise<Listing[]> {
    const result = await db.select().from(listings)
      .where(ilike(listings.name, `%${query}%`));
    return result;
  }

  async addListing(listing: InsertListing): Promise<Listing> {
    const result = await db.insert(listings).values(listing).returning();
    return result[0];
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  // Recommendation engine methods
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result[0] || null;
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(preferences.userId);
    
    if (existing) {
      const result = await db
        .update(userPreferences)
        .set({
          ...preferences,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, preferences.userId))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(userPreferences)
        .values(preferences)
        .returning();
      return result[0];
    }
  }

  async trackUserInteraction(interaction: InsertUserInteraction): Promise<UserInteraction> {
    const result = await db
      .insert(userInteractions)
      .values(interaction)
      .returning();
    return result[0];
  }

  async getUserInteractions(userId: string, limit: number = 50): Promise<UserInteraction[]> {
    const result = await db
      .select()
      .from(userInteractions)
      .where(eq(userInteractions.userId, userId))
      .orderBy(desc(userInteractions.timestamp))
      .limit(limit);
    return result;
  }

  async getRecommendationsForUser(userId: string, limit: number = 10): Promise<Listing[]> {
    // Get cached recommendations first
    const cached = await db
      .select({
        listing: listings,
        score: recommendationScores.score
      })
      .from(recommendationScores)
      .innerJoin(listings, eq(recommendationScores.listingId, listings.id))
      .where(eq(recommendationScores.userId, userId))
      .orderBy(desc(recommendationScores.score))
      .limit(limit);

    if (cached.length > 0) {
      return cached.map(r => r.listing);
    }

    // Fallback: Calculate recommendations on-the-fly
    await this.calculateRecommendationScores(userId);
    
    const fresh = await db
      .select({
        listing: listings,
        score: recommendationScores.score
      })
      .from(recommendationScores)
      .innerJoin(listings, eq(recommendationScores.listingId, listings.id))
      .where(eq(recommendationScores.userId, userId))
      .orderBy(desc(recommendationScores.score))
      .limit(limit);

    return fresh.map(r => r.listing);
  }

  async calculateRecommendationScores(userId: string): Promise<void> {
    const preferences = await this.getUserPreferences(userId);
    const interactions = await this.getUserInteractions(userId, 100);
    const allListings = await this.getListings();

    // Clear existing scores
    await db.delete(recommendationScores).where(eq(recommendationScores.userId, userId));

    const scores: Array<{
      userId: string;
      listingId: number;
      score: string;
      factors: any;
    }> = [];

    for (const listing of allListings) {
      let score = 0;
      const factors: any = {};

      // Category preference scoring
      if (preferences?.preferredCategories && preferences.preferredCategories.includes(listing.type)) {
        score += 0.3;
        factors.categoryMatch = 0.3;
      }

      // Price range preference scoring
      if (preferences?.preferredPriceRange === listing.priceRange) {
        score += 0.2;
        factors.priceMatch = 0.2;
      }

      // Tag preference scoring
      if (preferences?.preferredTags && listing.tags) {
        const tagMatches = preferences.preferredTags.filter(tag => 
          listing.tags!.includes(tag)
        ).length;
        const tagScore = Math.min(tagMatches * 0.1, 0.3);
        score += tagScore;
        factors.tagMatch = tagScore;
      }

      // Interaction history scoring
      const listingInteractions = interactions.filter(i => i.listingId === listing.id);
      if (listingInteractions.length > 0) {
        const interactionScore = Math.min(listingInteractions.length * 0.1, 0.4);
        score += interactionScore;
        factors.interactionHistory = interactionScore;
      }

      // Similar listings interaction scoring
      const similarInteractions = interactions.filter(i => {
        // Find the listing for this interaction to check type
        const interactedListing = allListings.find(l => l.id === i.listingId);
        return interactedListing?.type === listing.type;
      });
      
      if (similarInteractions.length > 0) {
        const similarScore = Math.min(similarInteractions.length * 0.05, 0.2);
        score += similarScore;
        factors.similarInteractions = similarScore;
      }

      // Rating boost
      if (listing.rating) {
        const ratingScore = (parseFloat(listing.rating.toString()) - 3) * 0.1;
        score += Math.max(0, ratingScore);
        factors.rating = Math.max(0, ratingScore);
      }

      // Recency boost for newer listings
      const daysSinceCreated = listing.createdAt 
        ? (Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        : 30;
      
      if (daysSinceCreated < 7) {
        const recencyScore = 0.1 * (1 - daysSinceCreated / 7);
        score += recencyScore;
        factors.recency = recencyScore;
      }

      scores.push({
        userId,
        listingId: listing.id,
        score: score.toFixed(3),
        factors
      });
    }

    // Insert calculated scores
    if (scores.length > 0) {
      await db.insert(recommendationScores).values(scores);
    }
  }
}

// Create storage instance
export const storage = new DatabaseStorage();