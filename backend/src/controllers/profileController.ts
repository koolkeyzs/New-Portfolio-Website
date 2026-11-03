import type { Request, Response } from "express";
import Profile from "../models/profile";
import uploadToCloudinary from "../utils/uploadToCloudinary";


export const createProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const existingProfile = await Profile.findOne();

    if (existingProfile) {
      res.status(400).json({
        success: false,
        message: "Profile already exists. Update the existing profile."
      });
      return;
    }

      // Upload image to Cloudinary
            const imageUrl = req.file
                ? await uploadToCloudinary(req.file)
                : undefined;
    

    const profile = await Profile.create({
      ...req.body,
      profileImage : imageUrl
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profile
    });

  } catch (error) {
    console.error("Create profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create profile."
    });
  }
};


export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile."
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {


    const updateData = { ...req.body };
    
            // Upload a new image only if one was provided
            if (req.file) {
                updateData.profileImage = await uploadToCloudinary(req.file);
            }
    
    
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProfile) {
      res.status(404).json({
        success: false,
        message: "Profile not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedProfile
    });

  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile."
    });
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedProfile = await Profile.findOneAndDelete({});

    if (!deletedProfile) {
      res.status(404).json({
        success: false,
        message: "Profile not found."
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully."
    });

  } catch (error) {
    console.error("Delete profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete profile."
    });
  }
};