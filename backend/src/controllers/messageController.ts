import type { Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/message";


export const createMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        message: "Name, email and message are required."
      });
      return;
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: newMessage
    });
  } catch (error) {
    console.error("Create message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message."
    });
  }
};


export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve messages."
    });
  }
};


export const getMessageById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid message ID."
      });
      return;
    }

    const message = await Message.findById(id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error("Get message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve message."
    });
  }
};


export const markMessageAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid message ID."
      });
      return;
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read.",
      data: message
    });
  } catch (error) {
    console.error("Mark message as read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update message."
    });
  }
};


export const deleteMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid message ID."
      });
      return;
    }

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully."
    });
  } catch (error) {
    console.error("Delete message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete message."
    });
  }
};