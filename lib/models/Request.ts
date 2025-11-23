import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRequest extends Document {
  senderId: string;    // Clerk ID of the person asking
  receiverId: string;  // Clerk ID of the person being asked
  status: "pending" | "accepted" | "rejected";
}

const RequestSchema = new Schema<IRequest>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

// Ensure a user can't send duplicate requests to the same person
RequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const Request: Model<IRequest> = mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);

export default Request;