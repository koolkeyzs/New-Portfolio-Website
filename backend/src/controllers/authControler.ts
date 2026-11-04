// TypeScript — authControler.ts

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign(
      { id: admin._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const logout = (req: Request, res: Response): void => {
  const { maxAge, ...clearOptions } = cookieOptions;

  res.clearCookie("token", clearOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};