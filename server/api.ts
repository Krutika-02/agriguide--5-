import express from "express";
import { Crop, User, Scheme } from "./models.js";
import { getCrops, getCropById, getAllUsers, saveCrop, updateCrop, deleteCrop, getSchemes, saveScheme, deleteScheme } from "./db.js";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Crop Routes
router.get("/crops", async (req, res) => {
  const { season } = req.query;
  const crops = await getCrops(season ? { season } : {});
  res.json(crops);
});

router.get("/crops/:id", async (req, res) => {
  try {
    const crop = await getCropById(req.params.id);
    if (!crop) return res.status(404).json({ error: "Crop not found" });
    res.json(crop);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// Admin Managed Routes
router.post("/crops", async (req, res) => {
  try {
    const crop = await saveCrop(req.body);
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: "Failed to create crop" });
  }
});

router.put("/crops/:id", isAdmin, async (req, res) => {
  try {
    const crop = await updateCrop(req.params.id, req.body);
    if (!crop) return res.status(404).json({ error: "Crop not found" });
    res.json(crop);
  } catch (err) {
    res.status(400).json({ error: "Failed to update crop" });
  }
});

router.delete("/crops/:id", isAdmin, async (req, res) => {
  try {
    await deleteCrop(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete" });
  }
});

// User Management (Admin Only)
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    // Ensure we always return an array
    const userArray = Array.isArray(users) ? users : [];
    res.json(userArray);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", users: [] });
  }
});

// Scheme Routes
router.get("/schemes", async (req, res) => {
  try {
    const { category } = req.query;
    const schemes = await getSchemes(category ? { category } : {});
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
});

router.post("/schemes", isAdmin, async (req, res) => {
  try {
    const { name, description, category, link } = req.body;
    
    if (!name || !description || !category || !link) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const scheme = await saveScheme({ name, description, category, link });
    res.status(201).json(scheme);
  } catch (err) {
    res.status(400).json({ error: "Failed to create scheme" });
  }
});

router.delete("/schemes/:id", isAdmin, async (req, res) => {
  try {
    await deleteScheme(req.params.id);
    res.json({ message: "Scheme deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete scheme" });
  }
});

export default router;
