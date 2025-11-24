"use server";

import UserModel from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import RequestModel from "@/lib/models/Request";

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
// ... keep existing imports ...

// Add this function at the bottom
export async function updateIdCard(imageUrl: string) {
  try {
    await connectDB();
    
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false };

    await UserModel.findOneAndUpdate(
      { clerkId: clerkUser.id },
      { 
        idCardUrl: imageUrl,
        rejectionReason: "" // <--- CLEAR THE REASON ON NEW UPLOAD
      }
    );

    return { success: true };
  } catch (error) {
    console.log("Error updating ID Card:", error);
    return { success: false };
  }
}
interface UpdateUserParams {
  clerkId: string;
  homeStation: string;
  collegeStation: string;
  startTime: string;
  bio: string;
  contactMethod: "whatsapp" | "instagram";
  contactValue: string;
}

// 2. The Update Function
export async function updateUser(params: UpdateUserParams) {
  try {
    console.log("1. updateUser Action Started..."); // Debug 1

    await connectDB();
    console.log("2. DB Connected inside Action"); // Debug 2

    console.log("3. Attempting to find and update user:", params.clerkId);
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { clerkId: params.clerkId },
      {
        homeStation: params.homeStation,
        collegeStation: params.collegeStation,
        startTime: params.startTime,
        bio: params.bio,
        contactMethod: params.contactMethod,
        contactValue: params.contactValue,
        onboarded: true,
      },
      { new: true }
    );

    console.log("4. Update Command Finished. Result:", updatedUser ? "Found & Updated" : "User Not Found"); // Debug 4
    // This tells Next.js: "The dashboard data is stale. Refresh it next time."
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.log("❌ Error updating user:", error);
    return { success: false };
  }
}

// ... existing imports ...

export async function getMatches(currentUserId: string) {
  try {
    await connectDB();

    // 1. Get Current User (contains friendRequests array and friends array)
    const currentUser = await UserModel.findOne({ clerkId: currentUserId });
    if (!currentUser) return [];

    // 2. Get Requests I SENT (Outgoing)
    const sentRequests = await RequestModel.find({
      senderId: currentUserId,
      status: "pending"
    });
    const sentRequestIds = sentRequests.map((req) => req.receiverId);

    // 3. Get Requests I RECEIVED (Incoming)
    // We can just use the array from the user profile we already fetched!
    const incomingRequestIds = currentUser.friendRequests || [];

    // 4. Fetch Matches
    const matches = await UserModel.find({
      clerkId: { $ne: currentUserId }, 
      collegeStation: currentUser.collegeStation,
      onboarded: true,
      isVerified: true,
    }).select("_id clerkId firstName lastName homeStation startTime imageUrl bio contactMethod friends todaysTime lastStatusUpdate"); 

    // 5. Add ALL Status Flags
    const matchesWithStatus = matches.map((match) => ({
      ...match.toObject(), 
      
      // Status A: Did I send them a request?
      hasPendingRequest: sentRequestIds.includes(match.clerkId),
      
      // Status B: Did THEY send ME a request?
      hasIncomingRequest: incomingRequestIds.includes(match.clerkId),
      
      // Status C: Are we already friends?
      isFriend: currentUser.friends.includes(match.clerkId)
    }));

    return JSON.parse(JSON.stringify(matchesWithStatus));
  } catch (error) {
    console.log("Error fetching matches:", error);
    return [];
  }
}


export async function getMyMates(currentUserId: string) {
  try {
    await connectDB();
    
    const currentUser = await UserModel.findOne({ clerkId: currentUserId });
    if (!currentUser) return { requests: [], friends: [] };

    // 1. Fetch details for Pending Requests
    // $in is a MongoDB magic operator: "Find all users whose clerkId is INSIDE this array"
    const requests = await UserModel.find({
      clerkId: { $in: currentUser.friendRequests }
    }).select("clerkId firstName lastName imageUrl homeStation startTime contactMethod contactValue");

    // 2. Fetch details for Accepted Friends
    const friends = await UserModel.find({
      clerkId: { $in: currentUser.friends }
    }).select("clerkId firstName lastName imageUrl homeStation startTime contactMethod contactValue bio todaysTime lastStatusUpdate");

    return {
      requests: JSON.parse(JSON.stringify(requests)),
      friends: JSON.parse(JSON.stringify(friends))
    };

  } catch (error) {
    console.log("Error fetching mates:", error);
    return { requests: [], friends: [] };
  }
}