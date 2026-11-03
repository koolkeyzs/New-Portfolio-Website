import type { Request, Response } from "express";
import Project from "../models/project";
import mongoose from "mongoose";
import uploadToCloudinary from "../utils/uploadToCloudinary";

export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      title,
      description,
      technologies,
      category,
      liveUrl,
      githubUrl,
      featured,
      published,
    } = req.body;

    // Validate required fields
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      !technologies
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
      return;
    }

    // Convert technologies into an array
    const technologyList: unknown[] = Array.isArray(technologies)
      ? technologies
      : typeof technologies === "string"
        ? technologies.split(",")
        : [];

    // Clean and validate technologies
    const cleanedTechnologies = technologyList
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (cleanedTechnologies.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please provide at least one valid technology.",
      });
      return;
    }

    // Validate Boolean values
    const validBoolean = (value: unknown): boolean => {
      return (
        value === true ||
        value === false ||
        value === "true" ||
        value === "false"
      );
    };

    if (
      (featured !== undefined && !validBoolean(featured)) ||
      (published !== undefined && !validBoolean(published))
    ) {
      res.status(400).json({
        success: false,
        message: "Featured and published must be true or false.",
      });
      return;
    }

    // Convert Boolean strings into actual Booleans
    const featuredValue = featured === true || featured === "true";
    const publishedValue = published === true || published === "true";

    // Upload image to Cloudinary
    const imageUrl = req.file
      ? await uploadToCloudinary(req.file)
      : undefined;

    
    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      technologies: cleanedTechnologies,
      category: category.trim(),
      liveUrl,
      githubUrl,
      featured: featuredValue,
      published: publishedValue,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });

  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
};

// Public: Get published projects
export const getPublicProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await Project.find({ published: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get public projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects",
    });
  }
};

// Admin: Get all projects
export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects",
    });
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
      return;
    }

    const projects = await Project.findById(id);

    if (!projects) {
      res.status(404).json({
        success: true,
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get projects error", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve project",
    });
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
      return;
    }

    const updateData = { ...req.body };

    // Upload a new image only if one was provided
    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file);
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      res.status(404).json({
        success: true,
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "project successfully updated",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });
      return;
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      res.status(404).json({
        success: true,
        message: "Project not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "project successfully deleted",
    });
  } catch (error) {
    console.error("Delete project error", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
