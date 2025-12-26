import type { Metadata, Viewport } from "next";
import { Outfit, Kalam } from "next/font/google"; 
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "sonner";
// import SecurityGate from "@/components/SecurityGate"; // <--- REMOVED (Gate is now open)
import { connectDB } from "@/lib/db";         
import UserModel from "@/lib/models/User"; 
import { currentUser } from "@clerk/nextjs/server";   
import BottomNav from "@/components/BottomNav"; 
import { ThemeProvider } from "next-themes"; 
import ThemeToggle from "@/components/ThemeToggle"; 

// Configure Fonts
const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: '--font-outfit',
  display: 'swap',
});

const kalam = Kalam({ 
  weight: '700', 
  subsets: ["latin"],
  variable: '--font-kalam',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "My Metro Mates",
  description: "Find your college commute partner",
  manifest: "/manifest.json",
};

export const viewport: Viewport = { themeColor: "#fdfbf7" };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    user = await currentUser();
  } catch (err) {
    // If Clerk throws "Not Found", it means the session is stale.
    // We just ignore it and treat the user as logged out.
    console.log("User session invalid or user deleted.");
  }
  
  // We determine if we should show the Nav bar
  // Logic: If they are logged in via Clerk, show the nav.
  const showNav = !!user; 
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} ${kalam.variable} antialiased pb-28 relative font-outfit bg-paper text-ink dark:bg-slate-900 dark:text-white transition-colors duration-300`}>
          
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            
            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-4 right-4 z-50">
               <ThemeToggle />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 max-w-md mx-auto min-h-screen border-x-2 border-dashed border-slate-200/60 dark:border-slate-700 bg-white/40 dark:bg-slate-900/50 backdrop-blur-[2px] shadow-2xl">
              {/* 🔓 GATE OPEN: Everyone who logs in can see the pages */}
              {children}
            </div>
            
            {/* Show Nav for ALL logged-in users (Guest or Verified) */}
            {showNav && <BottomNav userEmail={userEmail} />}
            
            <Toaster position="top-center" richColors theme="light" />
          
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}