import mongoose, { Schema, Document } from "mongoose";

interface IProject extends Document {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  published: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String
    },

    technologies: {
      type: [String],
      required: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    liveUrl: {
      type: String
    },

    githubUrl: {
      type: String
    },

    featured: {
      type: Boolean,
      default: false
    },

    published: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;