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
  required: true,
  validate: {
    validator: (value: string[]) =>
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => item.trim().length > 0),
    message: "At least one valid technology is required."
  }
},
    category: {
      type: String,
      required: true,
      trim: true
    },

    liveUrl: {
  type: String,
  trim: true,
  match: [/^https?:\/\/.+/i, "Please provide a valid live URL."]
},

githubUrl: {
  type: String,
  trim: true,
  match: [/^https?:\/\/.+/i, "Please provide a valid GitHub URL."]
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