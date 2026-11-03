import { Router } from "express";
import upload from '../middleware/upload'
import protect from "../middleware/auth";

import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} from "../controllers/profileController";



const router = Router();

// Get profile
router.get("/", getProfile);

// Create profile
router.post("/", protect, upload.single('profileImage') ,createProfile);

// Update profile
router.patch("/", protect,  upload.single('profileImage') , updateProfile);

// Delete profile
router.delete("/", protect, deleteProfile);

export default router;