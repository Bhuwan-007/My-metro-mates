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
  contactMethod: "whatsapp" | "instagram"; 
  contactValue: string;   // Optional: For them to connect off-platform
  bio?: string;

  // Verification
  isVerified: boolean;
  idCardUrl?: string;
  rejectionReason?: string;
  onboarded: boolean;

  friends: string[];        // Array of Clerk IDs
  friendRequests: string[];

  todaysTime?: string; 
  lastStatusUpdate?: Date;
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

    contactMethod: { type: String, enum: ["whatsapp", "instagram"], default: "instagram" },
    contactValue: { type: String, default: "" },
    bio: { type: String },

    isVerified: { type: Boolean, default: false },
    idCardUrl: { type: String },
    rejectionReason: { type: String, default: "" },
    onboarded: { type: Boolean, default: false },

    friends: { type: [String], default: [] },
    friendRequests: { type: [String], default: [] },

    todaysTime: { type: String },
    lastStatusUpdate: { type: Date },
  },
  { timestamps: true }
);

// This line checks if the model exists before creating it (Next.js Hot Reload fix)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;