import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUser, saveUser } from "./db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await findUser(email);
    if (existing) return res.status(400).json({ error: "User already exists" });

    await saveUser({
      name,
      email,
      password,
      phone,
      role: "farmer",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // In mock mode we use short-circuiting for simple passwords
    const isMatched = process.env.MONGODB_URI 
      ? await bcrypt.compare(password, user.password)
      : password === user.password;
      
    if (!isMatched) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ 
      id: user._id, 
      name: user.name,
      email: user.email,
      role: user.role 
    }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

export default router;
