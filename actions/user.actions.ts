"use server";

import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/User";
import RequestModel from "@/lib/models/Request";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// --- 1. CREATE / SYNC USER (Login) ---
export async function createUser() {
  try {
    await connectDB();
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    // Check if user exists
    const existingUser = await UserModel.findOne({ clerkId: clerkUser.id });
    if (existingUser) {
      return JSON.parse(JSON.stringify(existingUser));
    }

    // Create new user
    const newUser = new UserModel({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
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
    return null;
  }
}

// --- 2. UPDATE ID CARD (Verification) ---
export async function updateIdCard(imageUrl: string) {
  try {
    await connectDB();
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false };

    await UserModel.findOneAndUpdate(
      { clerkId: clerkUser.id },
      { 
        idCardUrl: imageUrl,
        rejectionReason: "" // Clear rejection error on new upload
      }
    );
    return { success: true };
  } catch (error) {
    console.log("Error updating ID Card:", error);
    return { success: false };
  }
}

// --- 3. UPDATE PROFILE (Onboarding) ---
interface UpdateUserParams {
  clerkId: string;
  homeStation: string;
  collegeStation: string;
  startTime: string;
  bio: string;
  contactMethod: "whatsapp" | "instagram";
  contactValue: string;
  gender: string; // <--- Added Gender here
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectDB();
    
    await UserModel.findOneAndUpdate(
      { clerkId: params.clerkId },
      {
        homeStation: params.homeStation,
        collegeStation: params.collegeStation,
        startTime: params.startTime,
        bio: params.bio,
        contactMethod: params.contactMethod,
        contactValue: params.contactValue,
        gender: params.gender, // <--- Saving Gender
        onboarded: true,
      },
      { new: true }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error updating user:", error);
    return { success: false };
  }
}

// --- 4. SEARCH MATCHES (The Algorithm) ---
export async function getMatches(currentUserId: string, filterTime?: boolean, filterGender?: string) {
  try {
    await connectDB();

    // Get Current User Data
    const currentUser = await UserModel.findOne({ clerkId: currentUserId });
    if (!currentUser) return [];

    // --- BUILD QUERY ---
    let query: any = {
      clerkId: { $ne: currentUserId }, // Exclude self
      collegeStation: currentUser.collegeStation, // Must go to same college station
      onboarded: true,
      isVerified: true,
    };

    // Gender Filter Logic
    if (filterGender && filterGender !== "all") {
      query.gender = filterGender;
    }

    // --- FETCH DATA ---
    const matches = await UserModel.find(query).select("_id clerkId firstName lastName homeStation startTime imageUrl bio contactMethod friends todaysTime lastStatusUpdate gender");

    // --- TIME FILTER LOGIC (JavaScript) ---
    let filteredMatches = matches;

    if (filterTime) {
        const myTimeMinutes = convertToMinutes(getLiveTime(currentUser));
        
        filteredMatches = matches.filter((match: any) => {
            const theirTimeStr = getLiveTime(match);
            const theirTimeMinutes = convertToMinutes(theirTimeStr);
            const diff = Math.abs(myTimeMinutes - theirTimeMinutes);
            return diff <= 60; // +/- 60 minutes
        });
    }

    // --- FETCH REQUEST STATUS ---
    const sentRequests = await RequestModel.find({ senderId: currentUserId, status: "pending" });
    const sentRequestIds = sentRequests.map((req) => req.receiverId);
    const incomingRequestIds = currentUser.friendRequests || [];

    // --- MERGE STATUS ---
    const matchesWithStatus = filteredMatches.map((match) => ({
      ...match.toObject(), 
      hasPendingRequest: sentRequestIds.includes(match.clerkId),
      hasIncomingRequest: incomingRequestIds.includes(match.clerkId),
      isFriend: currentUser.friends.includes(match.clerkId)
    }));

    return JSON.parse(JSON.stringify(matchesWithStatus));
  } catch (error) {
    console.log("Error fetching matches:", error);
    return [];
  }
}

// --- 5. GET MY MATES (Inbox) ---
export async function getMyMates(currentUserId: string) {
  try {
    await connectDB();
    const currentUser = await UserModel.findOne({ clerkId: currentUserId });
    if (!currentUser) return { requests: [], friends: [] };

    // Pending Requests (With Contact Info for Verification)
    const requests = await UserModel.find({
      clerkId: { $in: currentUser.friendRequests }
    }).select("clerkId firstName lastName imageUrl homeStation startTime contactMethod contactValue");

    // Friends (With Live Status)
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

// --- HELPERS ---
function convertToMinutes(timeStr: string) {
    if(!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
}

function getLiveTime(user: any) {
    if (user.todaysTime && user.lastStatusUpdate) {
        const statusDate = new Date(user.lastStatusUpdate);
        const today = new Date();
        if (statusDate.getDate() === today.getDate() && statusDate.getMonth() === today.getMonth()) {
            return user.todaysTime;
        }
    }
    return user.startTime;
}