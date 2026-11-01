import mongoose, { Schema, Document } from "mongoose";

interface ISkill extends Document {
  name: string;
  category: string;
  icon?: string;
  proficiency?: string;
  
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    icon: {
      type: String
    },

    proficiency: {
      type: String
    },

  },
  {
    timestamps: true
  }
);

const Skill = mongoose.model<ISkill>("Skill", skillSchema);

export default Skill;