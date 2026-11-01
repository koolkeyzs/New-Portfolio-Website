import mongoose, { Schema, Document } from "mongoose";

interface IProfile extends Document {
  name: string;
  title: string[];
  bio: string;
  profileImage?: string;
  location?: string;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
}

const profileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: [String],
      required: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true
    },
    profileImage: {
      type: String
    },
    location: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    githubUrl: {
      type: String
    },
    linkedinUrl: {
      type: String
    },
    resumeUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;