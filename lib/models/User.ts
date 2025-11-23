import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  
  // Metro Details
  homeStation: string;    // e.g., "Rithala"
  collegeStation: string; // e.g., "Kashmere Gate"
  metroLine: string;      // e.g., "Red" (Helps in filtering)
  startTime: string;      // e.g., "08:30"
  
  // Social
  instagramId?: string;   // Optional: For them to connect off-platform
  bio?: string;

  // Verification
  isVerified: boolean;
  idCardUrl?: string;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    imageUrl: { type: String },

    homeStation: { type: String, default: "" },
    collegeStation: { type: String, default: "" },
    metroLine: { type: String, default: "" },
    startTime: { type: String, default: "" },

    instagramId: { type: String },
    bio: { type: String },

    isVerified: { type: Boolean, default: false },
    idCardUrl: { type: String },
  },
  { timestamps: true }
);

// This line checks if the model exists before creating it (Next.js Hot Reload fix)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;