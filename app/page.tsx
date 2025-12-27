export const dynamic = 'force-dynamic';

import { SignedOut, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server"; 
import { createUser } from "@/actions/user.actions"; 
import { redirect } from "next/navigation";

export default async function Home() {
  const clerkUser = await currentUser();
  if (clerkUser) {
    await createUser(); 
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-(--bg-paper)">
      
      {/* Background doodles */}
      <div className="absolute top-10 -left-5 text-9xl opacity-17 rotate-12">🚇</div>
      <div className="absolute bottom-20 -right-5 text-9xl opacity-17 rotate-[-12]">🎒</div>

      <div className="relative z-10 w-full max-w-md text-center">
        
        {/* Sticker Logo */}
        <div className="w-24 h-24 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#000] rotate-[-5deg]">
           <img  src="/icon-192.png" alt="App Logo" className="w-16 h-16 object-contain rounded-full"/>
        </div>

        <h1 className="font-kalam text-6xl font-black  leading-[0.9] mb-4">
          Metro <br/>
          <span className="highlight-blue px-2">Mates</span>
        </h1>
        
        <p className="font-mono text-slate-600 text-sm mb-10 bg-white inline-block px-2 py-1 border border-slate-300 rotate-1">
           *Connect with students on your route.*
        </p>

        {/* Paper Card Login */}
        <SignedOut>
          <div className="paper-card p-6 rotate-1 max-w-xs mx-auto">
             <div className="tape"></div>
             
             <p className="text-violet-400 font-hand text-xl font-bold mb-4 mt-2">Join the Club:</p>

             <SignInButton mode="modal">
                <button className="btn-sketch w-full py-4 font-bold text-lg mb-3 shadow-md hover:text-white">
                  Log in with Email
                </button>
             </SignInButton>
             
             <SignInButton mode="modal" forceRedirectUrl="/verify-id">
                <button className="text-xs font-mono underline text-slate-500 hover:text-blue-300">
                  No College Email? Verify here.
                </button>
             </SignInButton>
          </div>
        </SignedOut>

      </div>
      
      <div className="absolute bottom-4 font-hand text-slate-400 text-xs">
        Made for Networking ✏️
      </div>
    </div>
  );
}