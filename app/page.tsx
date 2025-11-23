import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { createUser } from "@/actions/user.actions"; // <--- 1. Import the Sync Action

export default async function Home() { // <--- 2. Make component Async
  
  // <--- 3. Trigger the Sync
  // This runs on the server every time the page loads.
  // If the user is logged in, it saves them to MongoDB.
  await createUser(); 

  return (
    // OUTER CONTAINER: The Moving Tunnel (Dark Blue -> Slate -> Black)
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 animate-gradient-x text-white">
      
      {/* 1. The Grid Overlay (The "Tracks" feel) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* 2. The Vignette (Darkens corners for focus) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>

      {/* 3. The Glass Card (The "Station Window") */}
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/30 p-10 text-center shadow-2xl backdrop-blur-xl">
        
        {/* Floating Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
             {/* Metro Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
               <path d="M19 17h2l.64-2.54c.24-.959.24-1.962 0-2.92l-1.07-4.27A5 5 0 0 0 15.71 4H8.29a5 5 0 0 0-4.86 3.27l-1.07 4.27c-.24.959-.24 1.962 0 2.92L3 17h2" />
               <path d="m9 17-1-4" /><path d="m15 17 1-4" />
               <circle cx="9" cy="21" r="1" /><circle cx="15" cy="21" r="1" />
               <path d="M7 9h10" />
             </svg>
          </div>
        </div>

        {/* Headlines */}
        <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          My Metro <span className="text-blue-500">Mates</span>
        </h1>
        <p className="mb-10 text-lg text-slate-300">
          Your daily commute, <span className="text-blue-200 font-medium">reimagined.</span>
          <br />
          Find partners. Travel safe.
        </p>

        {/* SCENARIO 1: NOT Logged In */}
        {/* SCENARIO 1: NOT Logged In */}
        <SignedOut>
          <div className="mx-auto flex flex-col gap-4 w-full max-w-xs">
             
             {/* OPTION A: The Happy Path (College Email) */}
             <SignInButton mode="modal">
                <button className="group relative w-full overflow-hidden rounded-xl bg-white py-3.5 font-bold text-slate-900 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:cursor-pointer">
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>Login with College Email</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </button>
             </SignInButton>
             
             <div className="flex items-center gap-2 px-2">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-xs text-slate-500 uppercase">OR</span>
                <div className="h-px flex-1 bg-white/10"></div>
             </div>

             {/* OPTION B: The Manual Verification Path */}
             {/* Note: We point to /verify-id. Clerk will force login, then send them there. */}
             <SignInButton mode="modal" forceRedirectUrl="/verify-id">
                <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:cursor-pointer text-sm">
                  Don't have one? <span className="text-blue-400">Verify with College ID</span>
                </button>
             </SignInButton>

          </div>
        </SignedOut>

        {/* SCENARIO 2: ALREADY Logged In */}
        <SignedIn>
          <div className="flex flex-col items-center gap-4 rounded-xl bg-white/5 p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
               <div className="scale-110 ring-2 ring-blue-500/50 rounded-full">
                  <UserButton afterSignOutUrl="/"/>
               </div>
               <div className="text-left">
                  <p className="text-sm text-slate-400">Currently logged in</p>
                  <p className="text-sm font-bold text-white">Ready to travel?</p>
               </div>
            </div>
            
            <Link href="/dashboard" className="w-full">
              <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                Enter Dashboard
              </button>
            </Link>
          </div>
        </SignedIn>

      </div>
      
      {/* Footer Station Sign */}
      <div className="absolute bottom-8 flex items-center gap-4 text-xs font-medium text-slate-600 uppercase tracking-[0.2em]">
        <span className="animate-pulse text-green-500">●</span>
        <span>System Online</span>
        <span>•</span>
        <span>V 1.0</span>
      </div>

    </div>
  );
}