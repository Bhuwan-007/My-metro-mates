import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from '@clerk/nextjs'
import { currentUser } from "@clerk/nextjs/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Metro Mates",
  description: "Find your college commute partner",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch the current user on the server
  const user = await currentUser();
  
  // 2. Define your allowed domains
  // Add your specific college domains here
  const allowedDomains = ["@std.ggsipu.ac.in"]; 
  // ^ NOTE: Keep @gmail.com TEMPORARILY for your own testing, 
  // remove it once you have a college email to test with.

  // 3. The Gatekeeper Logic
  let isAllowed = true;
  if (user) {
    const email = user.emailAddresses[0]?.emailAddress;
    // Check if the email ends with any of the allowed domains
    isAllowed = allowedDomains.some(domain => email?.endsWith(domain));
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          
          {/* SCENARIO A: User is logged in BUT has the wrong email */}
          {user && !isAllowed ? (
            <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4 text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-2">Access Restricted 🔒</h1>
              <p className="text-gray-700 mb-6 max-w-md">
                Sorry, <strong>{user.firstName}</strong>. This app is currently exclusive to IP University students.
                <br/><br/>
                Please sign in with your college email (e.g., @ipu.ac.in).
              </p>
              <div className="p-2 bg-white rounded shadow-sm border border-gray-200">
                 <span className="text-sm text-gray-500 mr-2">You are currently signed in as:</span>
                 <span className="font-mono font-bold text-gray-800">{user.emailAddresses[0].emailAddress}</span>
              </div>
              <div className="mt-8">
                <SignOutButton>
                  <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold">
                    Sign Out & Try Again
                  </button>
                </SignOutButton>
              </div>
            </div>
          ) : (
            // SCENARIO B: User is valid (or not logged in yet) -> Show the App
            children
          )}
          
        </body>
      </html>
    </ClerkProvider>
  );
}