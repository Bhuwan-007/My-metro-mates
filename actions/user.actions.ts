"use server";

import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/User";
import RequestModel from "@/lib/models/Request";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getStationData } from "@/lib/metroData";
import { redirect } from "next/navigation";

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
    redirect("/dashboard");
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
export async function getMatches(
    currentUserId: string, 
    filterTime?: boolean, 
    filterGender?: string,
    filterMode?: string // <--- New Param
) {
  try {
    await connectDB();

    const currentUser = await UserModel.findOne({ clerkId: currentUserId });
    if (!currentUser) return [];

    // --- 1. BASE QUERY ---
    let query: any = {
      clerkId: { $ne: currentUserId },
      onboarded: true,
      isVerified: true,
    };

    if (filterGender && filterGender !== "all") {
      query.gender = filterGender;
    }

    // --- 2. MODE LOGIC ---
    if (filterMode === "route") {
        // ROUTE MATCHING: Fetch everyone (we filter by math later)
        // No specific college filter here.
    } else {
        // COLLEGE MATCHING (Default): Must go to same station
        query.collegeStation = currentUser.collegeStation;
    }

    // --- 3. FETCH DATA ---
    // We need 'homeStation' and 'collegeStation' to calculate the route
    const matches = await UserModel.find(query).select("_id clerkId firstName lastName homeStation collegeStation startTime imageUrl bio contactMethod friends todaysTime lastStatusUpdate gender");

    // --- 4. JS FILTERING (Time & Route Overlap) ---
    const myHome = getStationData(currentUser.homeStation);
    const myCollege = getStationData(currentUser.collegeStation);

    let filteredMatches = matches.filter((match: any) => {
        
        // A. TIME FILTER
        if (filterTime) {
            const myTimeMinutes = convertToMinutes(getLiveTime(currentUser));
            const theirTimeStr = getLiveTime(match);
            const theirTimeMinutes = convertToMinutes(theirTimeStr);
            const diff = Math.abs(myTimeMinutes - theirTimeMinutes);
            if (diff > 60) return false;
        }

        // B. ROUTE OVERLAP FILTER (The Math 🧮)
        if (filterMode === "route") {
            const theirHome = getStationData(match.homeStation);
            const theirCollege = getStationData(match.collegeStation);

            // Safety: If station not found in our list, skip
            if (!myHome || !myCollege || !theirHome || !theirCollege) return false;

            // Rule 1: Must be on the SAME LINE
            if (myHome.line !== theirHome.line) return false;

            // Rule 2: Calculate Overlap
            // Normalize Direction (Start is always smaller index)
            const myStart = Math.min(myHome.index, myCollege.index);
            const myEnd = Math.max(myHome.index, myCollege.index);
            const theirStart = Math.min(theirHome.index, theirCollege.index);
            const theirEnd = Math.max(theirHome.index, theirCollege.index);

            // Find intersection
            const overlapStart = Math.max(myStart, theirStart);
            const overlapEnd = Math.min(myEnd, theirEnd);
            const overlapCount = overlapEnd - overlapStart;

            // YOUR RULE: At least 4 stations overlap
            if (overlapCount < 4) return false;
        }

        return true;
    });

    // --- 5. ADD STATUS FLAGS ---
    const sentRequests = await RequestModel.find({ senderId: currentUserId, status: "pending" });
    const sentRequestIds = sentRequests.map((req) => req.receiverId);
    const incomingRequestIds = currentUser.friendRequests || [];

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

// Fetch users waiting for verification
export async function getPendingUsers() {
  try {
    await connectDB();
    // Find users who have an ID Card URL but are NOT verified yet
    const users = await UserModel.find({
      idCardUrl: { $exists: true, $ne: "" },
      isVerified: false,
    }).select("clerkId firstName lastName email idCardUrl");
    
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return [];
  }
}

// Approve a user
export async function approveUser(clerkId: string) {
  try {
    await connectDB();
    await UserModel.findOneAndUpdate({ clerkId }, { isVerified: true });
    revalidatePath("/admin"); // Refresh the admin list
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// Reject a user (Reset them)
export async function rejectUser(clerkId: string, reason: string) {
  try {
    await connectDB();
    await UserModel.findOneAndUpdate({ clerkId }, { 
        idCardUrl: "", // Clear the image
        rejectionReason: reason // Add the note
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ... existing imports

// NEW ACTION: Update Bio Only
export async function updateBio(bio: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    await UserModel.findOneAndUpdate(
      { clerkId: user.id },
      { bio: bio }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error updating bio:", error);
    return { success: false };
  }
}