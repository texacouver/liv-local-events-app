import express from "express";
import { createRoutes } from "./routes";
import { storage } from "./storage";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Storage - using the singleton database storage

// API routes
app.use("/api", createRoutes(storage));

// Serve static files in production or setup Vite in development
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
  app.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
} else {
  const server = app.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
  
  setupVite(app, server);
}

export default app;
