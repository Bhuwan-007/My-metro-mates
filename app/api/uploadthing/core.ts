import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Define the route "idCardImage"
  idCardImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Middleware: Runs before upload to check security
    .middleware(async () => {
      const user = await currentUser();
      // If not logged in, throw error
      if (!user) throw new Error("Unauthorized");
      // Return userId to the next step
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This runs AFTER upload finishes
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      // We will add database saving logic here later!
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;