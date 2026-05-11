import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ["farmer", "admin"], default: "farmer" },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", UserSchema);

const CropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, enum: ["Winter", "Summer", "Rainy"], required: true },
  imageUrl: String,
  howToGrow: {
    soilType: String,
    waterRequirements: String,
    duration: String,
    steps: [String], // Step-by-step instructions
  },
  diseases: [{
    name: String,
    symptoms: String,
    causes: String,
    prevention: String,
    medicine: String,
    medicineUsage: String, // usage details
  }],
  schemes: [{
    name: String,
    description: String,
    benefits: String,
    eligibility: String,
    applicationProcess: [String], // step-by-step
    link: String,
  }],
});

export const Crop = mongoose.model("Crop", CropSchema);

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["central", "state"], required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Scheme = mongoose.model("Scheme", SchemeSchema);
