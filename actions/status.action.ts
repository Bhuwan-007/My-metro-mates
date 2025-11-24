"use server";

import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setDailyStatus(time: string) {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Save the time AND the current date
    await UserModel.findOneAndUpdate(
      { clerkId: user.id },
      { 
        todaysTime: time,
        lastStatusUpdate: new Date() // Mark the timestamp
      }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("Error setting status:", error);
    return { success: false };
  }
}

export async function clearDailyStatus() {
  try {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Reset to empty
    await UserModel.findOneAndUpdate(
      { clerkId: user.id },
      { 
        todaysTime: "",
        lastStatusUpdate: null 
      }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}