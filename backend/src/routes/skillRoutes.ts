import { Router } from "express";

import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill
} from "../controllers/skillController";

import protect from "../middleware/auth";

const router = Router();

// Get all skills
router.get("/", protect, getSkills);

// Get one skill
router.get("/:id", protect, getSkillById);

// Create a skill
router.post("/", protect, createSkill);

// Update a skill
router.patch("/:id", protect, updateSkill);

// Delete a skill
router.delete("/:id", protect, deleteSkill);

export default router;