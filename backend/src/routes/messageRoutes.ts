import { Router } from "express";

import {
  createMessage,
  getMessages,
  getMessageById,
  markMessageAsRead,
  deleteMessage
} from "../controllers/messageController";

import protect from "../middleware/auth";

const router = Router();

// PUBLIC ROUTE
router.post("/", createMessage);

// PROTECTED ADMIN ROUTES
router.get("/", protect, getMessages);
router.get("/:id", protect, getMessageById);
router.patch("/:id/read", protect, markMessageAsRead);
router.delete("/:id", protect, deleteMessage);

export default router;