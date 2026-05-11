import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import authRoutes from "./server/auth.js";
import apiRoutes from "./server/api.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
      .then(async () => {
        console.log("✅ Connected to MongoDB");
        // Seed the requested admin if not exists
        const { User } = await import("./server/models.js");
        const adminExists = await User.findOne({ email: "chethan@gmail.com" });
        if (!adminExists) {
          const newAdmin = new User({
            name: "Chethan Admin",
            email: "chethan@gmail.com",
            password: "12345678",
            phone: "999",
            role: "admin"
          });
          await newAdmin.save();
          console.log("🛡️ Admin user 'chethan@gmail.com' seeded!");
        }
      })
      .catch(err => console.error("❌ MongoDB connection error:", err));
  } else {
    console.warn("⚠️ MONGODB_URI not found. Running in mock-mode (data will not persist).");
    // Simple mock for mongoose if needed or just let it fail gracefully on calls
  }

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Middleware to attach user to request if token exists
  app.use((req: any, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        };
      } catch (err: any) {
        console.warn("Invalid token:", err.message);
        // Invalid token - just skip setting req.user, don't throw
      }
    }
    next();
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api", apiRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AgriGuide server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
