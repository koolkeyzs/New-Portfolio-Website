import type { Request, Response } from "express";
import Skill from "../models/skill";
import mongoose from "mongoose";

export const createSkill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, category, icon, proficiency } = req.body;

    if (!name || !category) {
      res.status(400).json({
        success: false,
        message: "Skill name and category are required."
      });
      return;
    }

    const skill = await Skill.create({
      name,
      category,
      icon,
      proficiency
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully.",
      skill
    });

  } catch (error) {
    console.error("Create skill error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create skill."
    });
  }
};


export const getSkills = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills
    });

  } catch (error) {
    console.error("Get skills error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve skills."
    });
  }
};

export const getSkillById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid ID."
      });
      return;
    }


    const skill = await Skill.findById(id);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: "Skill not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      skill
    });

  } catch (error) {
    console.error("Get skill error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve skill."
    });
  }
};


export const updateSkill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid ID."
      });
      return;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedSkill) {
      res.status(404).json({
        success: false,
        message: "Skill not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully.",
      skill: updatedSkill
    });

  } catch (error) {
    console.error("Update skill error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update skill."
    });
  }
};


export const deleteSkill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid ID."
      });
      return;
    }


    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      res.status(404).json({
        success: false,
        message: "Skill not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully."
    });

  } catch (error) {
    console.error("Delete skill error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete skill."
    });
  }
};
