export const dynamic = 'force-dynamic';

import { createUser } from "@/actions/user.actions";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusWidget from "@/components/StatusWidget";
import BioWidget from "@/components/BioWidget";
import InstallPrompt from "@/components/InstallPrompt";
import { Outfit } from "next/font/google";
const outfit = Outfit({ subsets: ["latin"], weight: ['500'] }); // Load Super Bold

export default async function DashboardPage() {
  const user = await createUser();
  if (!user) redirect("/");
  if (!user.onboarded) redirect("/onboarding");

  let activeTime = ""; 
  if (user.todaysTime && user.lastStatusUpdate) {
      const statusDate = new Date(user.lastStatusUpdate);
      const today = new Date();
      if (statusDate.getDate() === today.getDate() && statusDate.getMonth() === today.getMonth()) {
          activeTime = user.todaysTime;
      }
  }

  return (
    <div className="min-h-screen p-6 pb-32 bg-(--bg-paper)">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-10 relative px-2">
         <div className="-rotate-1">
            <p className="font-kalam text-xl  mb-0 transform -rotate-2">Hello there,</p>
            {/* BIG BOLD NAME */}
            <h1 className="text-4xl md:text-6xl font-kalam font-black leading-tight tracking-tight underline-sketch inline-block px-3 py-1 wrap-break-word max-w-full">
                {user.firstName}
            </h1>
         </div>
         <div className="p-1.5 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#000] rotate-2 hover:rotate-0 transition-transform">
            <UserButton />
         </div>
      </div>

      <div className="space-y-10 max-w-md mx-auto">
        
        {/* 1. THE MAIN PASS */}
        <div className="paper-card p-8 relative rotate-1 bg-white group">
            <div className="tape"></div>

            <div className="flex justify-between items-start mb-8 mt-2">
                <span className="font-kalam text-2xl text-slate-500 border-b-2 border-slate-900 border-dashed pb-1">
                    Student Pass
                </span>
                <Link href="/onboarding" className="font-outfit text-sm text-black font-bold bg-slate-100 hover:bg-yellow-200 cursor-pointer px-3 py-1 rounded-full border border-slate-300 transition-colors">
                    Edit ✎
                </Link>
            </div>

            {/* Route */}
           {/* ... inside app/dashboard/page.tsx ... */}

        {/* Route */}
            <div className="flex gap-5 items-stretch">
                <div className="flex flex-col items-center pt-2">
                    <div className="w-5 h-5 rounded-full border-[3px] border-slate-900 bg-white"></div>
                    <div className="w-1.5 flex-1 border-l-[3px] border-slate-900 border-dashed my-1"></div>
                    <div className="w-5 h-5 rounded-full border-[3px] border-slate-900 bg-slate-900"></div>
                </div>

                <div className="flex flex-col gap-10 w-full py-1">
                    
                    {/* BOARDING STATION */}
                   {/* ... inside the Route section ... */}
                    <div className="-rotate-1">
                        <p className="font-kalam text-lg text-slate-500 mb-1">Boarding From</p>
                        {/* FORCE THE FONT HERE 👇 */}
                        <p className={`${outfit.className} text-4xl font-black  leading-none tracking-tight`}>
                            {user.homeStation}
                        </p>
                    </div>

                    {/* DROP OFF STATION */}
                    <div className="rotate-1">
                        <p className="font-kalam text-lg text-slate-500 mb-1">Going To</p>
                        {/* UPDATED FONT CLASSES 👇 */}
                        <p className={`${outfit.className} text-4xl font-black  leading-none tracking-tight`}>
                            {user.collegeStation}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. STATUS STICKY NOTE */}
        <div className="bg-[#fff9c4] p-6 shadow-sm border border-black/5 -rotate-1 relative">
            <div className="absolute -top-3 left-1/2 w-3 h-3 rounded-full bg-red-500 border border-black shadow-sm"></div>

            <div className="flex justify-between items-center mb-2">
                <p className="font-kalam text-2xl font-bold text-slate-800">My Schedule</p>
                <div className={`font-mono font-bold text-xs border-2 border-black px-2 py-0.5 ${activeTime ? 'bg-green-400 text-black' : 'bg-white text-slate-400'}`}>
                    {activeTime ? "LIVE" : "OFF"}
                </div>
            </div>
            
            <StatusWidget 
                currentStatus={activeTime} 
                defaultTime={user.startTime} 
            />
        </div>

        {/* 3. BIO */}
        <div className="border-l-[6px] border-slate-900 pl-4 py-2 bg-slate-50 rotate-1">
           <BioWidget initialBio={user.bio || ""} />
        </div>

        {/* 4. ACTION BUTTON */}
        <Link href="/search" className="block group pt-4">
            <button className="btn-sketch w-full h-20 flex items-center justify-center gap-3 text-2xl font-black shadow-lg cursor-pointer">
                <span>Find Mates</span>
                <span className="text-3xl">➜</span>
            </button>
        </Link>

        <InstallPrompt />
        
        <div className="text-center pt-8 pb-4">
             <Link href="/about" className="inline-block hover:scale-105 transition-transform">
                <div className="font-kalam text-violet-800 text-xl border-b border-dashed border-slate-400 hover:text-black hover:border-black">
                    📝 Publisher
                </div>
             </Link>
             <p className="font-mono text-[10px] text-slate-300 mt-4 uppercase">v1.0• </p>
        </div>

      </div>
    </div>
  );
}