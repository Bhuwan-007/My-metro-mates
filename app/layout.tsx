import type { Metadata, Viewport } from "next";
import { Outfit, Kalam } from "next/font/google"; 
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "sonner";
import SecurityGate from "@/components/SecurityGate"; 
import { connectDB } from "@/lib/db";         
import UserModel from "@/lib/models/User"; 
import { currentUser } from "@clerk/nextjs/server";   
import BottomNav from "@/components/BottomNav"; 
import { ThemeProvider } from "next-themes"; // Import ThemeProvider
import ThemeToggle from "@/components/ThemeToggle"; // <--- IMPORT THE TOGGLE

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
  const user = await currentUser();
  const allowedDomains = ["@std.ggsipu.ac.in", "@ipu.ac.in"]; 
  let isAllowed = false;
  let userEmail = "";
  let showNav = false; 

  if (user) {
    userEmail = user.emailAddresses[0]?.emailAddress || "";
    const isCollegeEmail = allowedDomains.some(domain => userEmail.endsWith(domain));
    if (isCollegeEmail) {
       isAllowed = true;
       showNav = true;
    } else {
       await connectDB();
       const dbUser = await UserModel.findOne({ clerkId: user.id });
       if (dbUser && dbUser.isVerified) {
          isAllowed = true;
          showNav = true;
       }
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} ${kalam.variable} antialiased pb-28 relative font-outfit bg-paper text-ink dark:bg-slate-900 dark:text-white transition-colors duration-300`}>
          
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            
            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-4 right-4 z-50">
               <ThemeToggle />
            </div>

            <div className="relative z-10 max-w-md mx-auto min-h-screen border-x-2 border-dashed border-slate-200/60 dark:border-slate-700 bg-white/40 dark:bg-slate-900/50 backdrop-blur-[2px] shadow-2xl">
              {user ? (
                 <SecurityGate isAllowed={isAllowed} userEmail={userEmail}>
                    {children}
                 </SecurityGate>
              ) : (
                 children
              )}
            </div>
            
            {showNav && <BottomNav userEmail={userEmail} />}
            
            <Toaster position="top-center" richColors theme="light" />
          
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}