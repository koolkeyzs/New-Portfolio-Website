import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
