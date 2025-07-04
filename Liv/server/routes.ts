import { Router } from "express";
import { z } from "zod";
import { IStorage } from "./storage";
import { insertListingSchema, insertUserPreferencesSchema, insertUserInteractionSchema } from "@shared/schema";
import { seedDatabase } from "./seed";

export function createRoutes(storage: IStorage) {
  const router = Router();

  // GET /api/listings - Get all listings
  router.get("/listings", async (req, res) => {
    try {
      const listings = await storage.getListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  // GET /api/listings/:id - Get listing by ID
  router.get("/listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid listing ID" });
      }
      
      const listing = await storage.getListingById(id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });

  // GET /api/listings/type/:type - Get listings by type
  router.get("/listings/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const listings = await storage.getListingsByType(type);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listings by type" });
    }
  });

  // GET /api/listings/search - Search listings
  router.get("/listings/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const listings = await storage.searchListings(query);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to search listings" });
    }
  });

  // POST /api/listings - Add new listing
  router.post("/listings", async (req, res) => {
    try {
      const validatedData = insertListingSchema.parse(req.body);
      const newListing = await storage.addListing(validatedData);
      res.status(201).json(newListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid listing data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  // POST /api/seed - Seed database with Vancouver venues
  router.post("/seed", async (req, res) => {
    try {
      await seedDatabase();
      res.json({ message: "Database seeded successfully with Vancouver venues" });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  // Recommendation Engine Routes

  // GET /api/recommendations - Get personalized recommendations for current user
  router.get("/recommendations", async (req, res) => {
    try {
      // Mock user ID for development - will be replaced with Replit Auth later
      const userId = (req as any).user?.claims?.sub || "mock-user-1";

      const limit = parseInt(req.query.limit as string) || 10;
      const recommendations = await storage.getRecommendationsForUser(userId, limit);
      res.json(recommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // GET /api/preferences - Get user preferences
  router.get("/preferences", async (req, res) => {
    try {
      // Mock user ID for development - will be replaced with Replit Auth later
      const userId = (req as any).user?.claims?.sub || "mock-user-1";

      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  // POST /api/preferences - Create or update user preferences
  router.post("/preferences", async (req, res) => {
    try {
      // Mock user ID for development - will be replaced with Replit Auth later
      const userId = (req as any).user?.claims?.sub || "mock-user-1";

      const validatedData = insertUserPreferencesSchema.parse({
        ...req.body,
        userId
      });

      const preferences = await storage.upsertUserPreferences(validatedData);
      
      // Recalculate recommendations when preferences change
      await storage.calculateRecommendationScores(userId);
      
      res.json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid preference data", details: error.errors });
      }
      console.error("Failed to update preferences:", error);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // POST /api/interactions - Track user interaction
  router.post("/interactions", async (req, res) => {
    try {
      // Mock user ID for development - will be replaced with Replit Auth later
      const userId = (req as any).user?.claims?.sub || "mock-user-1";

      const validatedData = insertUserInteractionSchema.parse({
        ...req.body,
        userId
      });

      const interaction = await storage.trackUserInteraction(validatedData);
      
      // Periodically recalculate recommendations based on new interactions
      if (Math.random() < 0.1) { // 10% chance to recalculate
        await storage.calculateRecommendationScores(userId);
      }
      
      res.json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid interaction data", details: error.errors });
      }
      console.error("Failed to track interaction:", error);
      res.status(500).json({ error: "Failed to track interaction" });
    }
  });

  // POST /api/recommendations/refresh - Force refresh recommendations
  router.post("/recommendations/refresh", async (req, res) => {
    try {
      // Mock user ID for development - will be replaced with Replit Auth later
      const userId = (req as any).user?.claims?.sub || "mock-user-1";

      await storage.calculateRecommendationScores(userId);
      const recommendations = await storage.getRecommendationsForUser(userId);
      
      res.json({
        message: "Recommendations refreshed successfully",
        recommendations
      });
    } catch (error) {
      console.error("Failed to refresh recommendations:", error);
      res.status(500).json({ error: "Failed to refresh recommendations" });
    }
  });

  return router;
}
