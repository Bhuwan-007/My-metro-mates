"use server";

import { connectDB } from "@/lib/db";
import Request from "@/lib/models/Request"; 
import UserModel from "@/lib/models/User";
import { currentUser } from "@clerk/nextjs/server";

// --- 1. SEND REQUEST ---
export async function sendFriendRequest(receiverClerkId: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Check duplicates
    const existingRequest = await Request.findOne({
      senderId: user.id,
      receiverId: receiverClerkId,
    });

    if (existingRequest) {
      return { success: false, message: "Request already sent!" };
    }

    // Create Ticket
    await Request.create({
      senderId: user.id,
      receiverId: receiverClerkId,
      status: "pending",
    });

    // Update Receiver's List
    await UserModel.findOneAndUpdate(
      { clerkId: receiverClerkId },
      { $push: { friendRequests: user.id } } 
    );

    return { success: true, message: "Request Sent!" };
  } catch (error: any) {
    console.log("Error sending request:", error);
    return { success: false, message: "Failed to send request" };
  }
}

// --- 2. ACCEPT REQUEST (Improved Logic) ---
export async function acceptFriendRequest(senderClerkId: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Verify request exists
    const request = await Request.findOne({
      senderId: senderClerkId,
      receiverId: user.id,
      status: "pending",
    });

    if (!request) return { success: false, message: "Request not found" };

    // ATOMIC UPDATE: Add to friends list (Using $addToSet to prevent duplicates)
    
    // Update ME (Receiver)
    await UserModel.findOneAndUpdate(
      { clerkId: user.id },
      { 
        $addToSet: { friends: senderClerkId }, 
        $pull: { friendRequests: senderClerkId } 
      }
    );

    // Update SENDER
    await UserModel.findOneAndUpdate(
      { clerkId: senderClerkId },
      { 
        $addToSet: { friends: user.id },
        $pull: { friendRequests: user.id }
      }
    );

    // CLEANUP: Delete ALL requests between these two users (A->B and B->A)
    await Request.deleteMany({
      $or: [
        { senderId: senderClerkId, receiverId: user.id },
        { senderId: user.id, receiverId: senderClerkId }
      ]
    });

    return { success: true, message: "Connected!" };
  } catch (error) {
    console.log("Error accepting request:", error);
    return { success: false, message: "Failed to accept" };
  }
}

// --- 3. REJECT REQUEST (Restored!) ---
export async function rejectFriendRequest(senderClerkId: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Delete the ticket in the Request Collection
    await Request.findOneAndDelete({
      senderId: senderClerkId,
      receiverId: user.id,
    });

    // 2. Remove notification from YOUR profile array
    await UserModel.findOneAndUpdate(
      { clerkId: user.id },
      { $pull: { friendRequests: senderClerkId } }
    );

    return { success: true, message: "Request Rejected" };
  } catch (error) {
    console.log("Error rejecting:", error);
    return { success: false, message: "Failed to reject" };
  }
}

// 4. REMOVE FRIEND (Unfriend)
export async function removeFriend(friendClerkId: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Remove friend from YOUR list
    await UserModel.findOneAndUpdate(
      { clerkId: user.id },
      { $pull: { friends: friendClerkId } }
    );

    // Remove YOU from THEIR list
    await UserModel.findOneAndUpdate(
      { clerkId: friendClerkId },
      { $pull: { friends: user.id } }
    );

    return { success: true, message: "Connection Removed" };
  } catch (error) {
    console.log("Error removing friend:", error);
    return { success: false, message: "Failed to remove" };
  }
}

// 5. CANCEL SENT REQUEST (Undo)
export async function cancelSentRequest(receiverClerkId: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Delete the ticket
    await Request.findOneAndDelete({
      senderId: user.id,
      receiverId: receiverClerkId,
      status: "pending"
    });

    // Remove notification from receiver
    await UserModel.findOneAndUpdate(
      { clerkId: receiverClerkId },
      { $pull: { friendRequests: user.id } }
    );

    return { success: true, message: "Request Cancelled" };
  } catch (error) {
    console.log("Error cancelling:", error);
    return { success: false, message: "Failed to cancel" };
  }
}