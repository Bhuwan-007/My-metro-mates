"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react"; 
import Link from "next/link";

interface SecurityGateProps {
  children: React.ReactNode;
  isAllowed: boolean;
  userEmail: string;
}

export default function SecurityGate({ children, isAllowed, userEmail }: SecurityGateProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 1. BLOCK UNVERIFIED: If not allowed, force them to verify-id
    if (!isAllowed && pathname !== "/verify-id") {
      router.push("/verify-id");
    }

    // 2. BLOCK VERIFIED: If they ARE allowed, don't let them see the verify page!
    //    Send them straight to the Home Page / Dashboard
    if (isAllowed && pathname === "/verify-id") {
      router.push("/");
    }
    
  }, [isAllowed, pathname, router]);

  // --- RENDERING LOGIC ---

  // A. If they are allowed, show the app
  // (Unless they are on verify-id, in which case the useEffect above will redirect them in a split second)
  if (isAllowed) {
    return <>{children}</>;
  }

  // B. If they are on the verify page (and unverified), show the verify page
  if (pathname === "/verify-id") {
    return <>{children}</>;
  }

  // C. Loading/Redirecting Screen (Metro Tunnel)
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 animate-gradient-x text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="h-12 w-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-xl font-bold text-white mb-2">Redirecting...</h1>
        <p className="text-slate-400 text-sm">Validating your ticket.</p>
      </div>
    </div>
  );
}