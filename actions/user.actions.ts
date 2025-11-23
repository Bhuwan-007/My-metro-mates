"use server";

import UserModel from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function createUser() {
  try {
    await connectDB();
    
    // 1. Get the current user from Clerk
    const clerkUser = await currentUser();
    
    // Safety Check: If no user is logged in, stop immediately
    if (!clerkUser) {
        return null;
    }

    // 2. Check if this user already exists in OUR database
    const existingUser = await UserModel.findOne({ clerkId: clerkUser.id });

    if (existingUser) {
      return JSON.parse(JSON.stringify(existingUser)); 
    }

    // 3. If not, create them using the "new" keyword (Fixes the TS error)
    const newUser = new UserModel({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      // We use "!" to tell TypeScript: "Trust me, firstName exists"
      firstName: clerkUser.firstName || "Unknown", 
      lastName: clerkUser.lastName || "User",
      imageUrl: clerkUser.imageUrl,
      // Auto-verify if college email
      isVerified: clerkUser.emailAddresses[0].emailAddress.endsWith("@std.ggsipu.ac.in"), 
    });

    await newUser.save();

    return JSON.parse(JSON.stringify(newUser));
    
  } catch (error) {
    console.log("Error creating user:", error);
    // We return null instead of throwing so the app doesn't crash completely
    return null; 
  }
}