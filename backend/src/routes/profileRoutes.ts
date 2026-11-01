import { Router } from "express";

import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} from "../controllers/profileController";

import protect from "../middleware/auth";

const router = Router();

// Get profile
router.get("/", protect, getProfile);

// Create profile
router.post("/", protect, createProfile);

// Update profile
router.patch("/", protect, updateProfile);

// Delete profile
router.delete("/", protect, deleteProfile);

export default router;