"use server";

import { connectDB } from "@/lib/db";
import Request from "@/lib/models/Request"; 
import UserModel from "@/lib/models/User";
import { currentUser } from "@clerk/nextjs/server";

export async function sendFriendRequest(receiverClerkId: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Check duplicates
    const existingRequest = await Request.findOne({
      senderId: user.id,
      receiverId: receiverClerkId,
    });

    if (existingRequest) {
      return { success: false, message: "Request already sent!" };
    }

    // 2. Create Ticket
    await Request.create({
      senderId: user.id,
      receiverId: receiverClerkId,
      status: "pending",
    });

    // 3. Update Receiver's List
    await UserModel.findOneAndUpdate(
      { clerkId: receiverClerkId },
      { $push: { friendRequests: user.id } } // <--- This requires File 1 to be correct!
    );

    return { success: true, message: "Request Sent!" };
  } catch (error: any) {
    console.log("Error sending request:", error);
    return { success: false, message: "Failed to send request" };
  }
}