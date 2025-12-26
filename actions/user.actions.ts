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

    // 1. Update the Database
    await UserModel.findOneAndUpdate(
      { clerkId: clerkUser.id },
      { 
        idCardUrl: imageUrl,
        rejectionReason: "" // Clear any old rejection errors
      }
    );

    // 2. Clear the Cache (Critical step!)
    revalidatePath("/verify-id");
    revalidatePath("/dashboard");
    
    return { success: true };

  } catch (error) {
    console.log("Error updating ID Card:", error);
    return { success: false };
  }
  
  // ❌ NO REDIRECT HERE! 
  // We let the frontend refresh the page so the user sees the "Pending" screen.
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
  gender: string;
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
        gender: params.gender,
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

// --- 4. SEARCH MATCHES (The Algorithm + Security Gate) ---
export async function getMatches(
    currentUserId: string, 
    filterTime?: boolean, 
    filterGender?: string,
    filterMode?: string
) {
  try {
    await connectDB();

    // 1. Get Current User to check permissions
    const currentUser = await UserModel.findOne({ clerkId: currentUserId });
    if (!currentUser) return [];

    const isViewerVerified = currentUser.isVerified; // <--- CHECK VERIFICATION STATUS

    // 2. BASE QUERY
    let query: any = {
      clerkId: { $ne: currentUserId },
      onboarded: true,
      isVerified: true, // Only show Verified users in results? (Optional: remove if you want to see unverified ppl too)
    };

    if (filterGender && filterGender !== "all") {
      query.gender = filterGender;
    }

    // 3. MODE LOGIC
    if (filterMode === "route") {
        // ROUTE MATCHING: Fetch everyone (filtered by math later)
    } else {
        // COLLEGE MATCHING (Default): Must go to same station
        query.collegeStation = currentUser.collegeStation;
    }

    // 4. FETCH DATA
    const matches = await UserModel.find(query).select("_id clerkId firstName lastName homeStation collegeStation startTime imageUrl bio contactMethod friends todaysTime lastStatusUpdate gender");

    // 5. JS FILTERING (Time & Route Overlap)
    const myHome = getStationData(currentUser.homeStation);
    const myCollege = getStationData(currentUser.collegeStation);

    let filteredMatches = matches.filter((match: any) => {
        
        // A. TIME FILTER
        // (Note: Even if unverified, we CAN filter by time logic on the server, 
        // we just won't SHOW the time to them on the client)
        if (filterTime) {
            const myTimeMinutes = convertToMinutes(getLiveTime(currentUser));
            const theirTimeStr = getLiveTime(match);
            const theirTimeMinutes = convertToMinutes(theirTimeStr);
            const diff = Math.abs(myTimeMinutes - theirTimeMinutes);
            if (diff > 60) return false;
        }

        // B. ROUTE OVERLAP FILTER
        if (filterMode === "route") {
            const theirHome = getStationData(match.homeStation);
            const theirCollege = getStationData(match.collegeStation);

            if (!myHome || !myCollege || !theirHome || !theirCollege) return false;

            // Rule 1: Same Line
            if (myHome.line !== theirHome.line) return false;

            // Rule 2: Overlap Calculation
            const myStart = Math.min(myHome.index, myCollege.index);
            const myEnd = Math.max(myHome.index, myCollege.index);
            const theirStart = Math.min(theirHome.index, theirCollege.index);
            const theirEnd = Math.max(theirHome.index, theirCollege.index);

            const overlapStart = Math.max(myStart, theirStart);
            const overlapEnd = Math.min(myEnd, theirEnd);
            const overlapCount = overlapEnd - overlapStart;

            if (overlapCount < 4) return false;
        }

        return true;
    });

    // 6. ADD STATUS & SECURITY SANITIZATION 🔒
    const sentRequests = await RequestModel.find({ senderId: currentUserId, status: "pending" });
    const sentRequestIds = sentRequests.map((req) => req.receiverId);
    const incomingRequestIds = currentUser.friendRequests || [];

    const finalMatches = filteredMatches.map((match) => {
      const matchObj = match.toObject();

      // Check relationship
      const isFriend = currentUser.friends.includes(match.clerkId);
      
      // SECURITY CHECK:
      // If the viewer is NOT verified, we hide sensitive data (Times & Live Status)
      // Exception: If they are already friends, we usually allow seeing it.
      const canSeeData = isViewerVerified || isFriend;

      return {
        ...matchObj,
        // If not verified, overwrite these fields with NULL
        startTime: canSeeData ? matchObj.startTime : null,
        todaysTime: canSeeData ? matchObj.todaysTime : null,
        lastStatusUpdate: canSeeData ? matchObj.lastStatusUpdate : null,
        
        // Add flags
        hasPendingRequest: sentRequestIds.includes(match.clerkId),
        hasIncomingRequest: incomingRequestIds.includes(match.clerkId),
        isFriend
      };
    });

    return JSON.parse(JSON.stringify(finalMatches));
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

    // Pending Requests
    const requests = await UserModel.find({
      clerkId: { $in: currentUser.friendRequests }
    }).select("clerkId firstName lastName imageUrl homeStation startTime contactMethod contactValue");

    // Friends (Always full access)
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
    revalidatePath("/admin"); 
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// Reject a user
export async function rejectUser(clerkId: string, reason: string) {
  try {
    await connectDB();
    await UserModel.findOneAndUpdate({ clerkId }, { 
        idCardUrl: "", 
        rejectionReason: reason 
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// Update Bio Only
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