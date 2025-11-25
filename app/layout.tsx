import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { currentUser } from "@clerk/nextjs/server";
import SecurityGate from "@/components/SecurityGate"; 
// 1. NEW IMPORTS (To talk to the database)
import { connectDB } from "@/lib/db";         
import UserModel from "@/lib/models/User";    
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Metro Mates",
  description: "Find your college commute partner",
  manifest: "/manifest.json", // <--- LINK THE MANIFEST
  icons: {
    icon: "/icon-192.png", 
    apple: "/icon-192.png",
  }
};
export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch Clerk User
  const user = await currentUser();
  
  // 2. Default Access Rules
  const allowedDomains = ["@std.ggsipu.ac.in", "@mait.ac.in"]; 
  
  // Start as FALSE (Blocked) by default for safety
  let isAllowed = false; 
  let userEmail = "";

  if (user) {
    userEmail = user.emailAddresses[0]?.emailAddress || "";
    
    // CHECK A: Is it a College Email?
    const isCollegeEmail = allowedDomains.some(domain => userEmail.endsWith(domain));

    if (isCollegeEmail) {
       // Path 1: They have a college email -> ALLOW
       isAllowed = true;
    } else {
       // Path 2: They have a Gmail (Manual Verification) -> CHECK DATABASE
       await connectDB();
       
       // Find user in DB
       const dbUser = await UserModel.findOne({ clerkId: user.id });
       
       // If DB says "isVerified: true", let them in!
       if (dbUser && dbUser.isVerified) {
          isAllowed = true;
       }
    }
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {user ? (
             <SecurityGate isAllowed={isAllowed} userEmail={userEmail}>
                {children}
             </SecurityGate>
          ) : (
             children
          )}
          <Toaster position="top-center" richColors theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}