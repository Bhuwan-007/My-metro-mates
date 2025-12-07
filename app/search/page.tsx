export const dynamic = 'force-dynamic';

import { createUser, getMatches } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import ConnectButton from "@/components/ConnectButton";
import FilterBar from "@/components/FilterBar";
import BottomNav from "@/components/BottomNav"; // Ensure Nav is here if not in layout

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ time?: string, gender?: string, mode?: string }> 
}) {
  const params = await searchParams;
  const user = await createUser();
  
  if (!user) redirect("/");
  if (!user.onboarded) redirect("/onboarding");

  const matches = await getMatches(
      user.clerkId, 
      params.time === "true", 
      params.gender,
      params.mode
  );
  
  const isVerified = user.isVerified;

  return (
    <div className="min-h-screen p-6 pb-32 font-sans overflow-x-hidden">
      
      {/* --- HANDWRITTEN HEADER --- */}
      <div className="relative mb-8 text-center rotate-[-1deg]">
        <div className="inline-block relative">
            <h1 className="font-hand text-5xl font-bold text-slate-900 relative z-10">
                Find Travelers
            </h1>
            {/* Highlighter effect behind text */}
            <div className="absolute bottom-2 left-0 w-full h-4 bg-[#b3e5fc] -z-0 transform -rotate-2"></div>
        </div>
        <p className="font-hand text-xl text-slate-500 mt-1">
            Going to <span className="font-bold underline decoration-wavy decoration-orange-400">{user.collegeStation}</span>
        </p>
      </div>

      {/* --- FILTER BAR (Looks like stickers) --- */}
      <div className="mb-8 rotate-1">
         <FilterBar />
      </div>
      
      {/* --- UNVERIFIED WARNING (Ripped Paper) --- */}
      {!isVerified && (
          <div className="mb-8 mx-auto max-w-sm bg-red-50 border-2 border-red-800 border-dashed p-4 rotate-[-1deg] shadow-sm relative">
             <div className="absolute -top-3 -left-3 w-8 h-8 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-white font-bold">!</div>
             <p className="font-hand text-xl font-bold text-red-800">Guest Mode</p>
             <p className="text-sm font-sans mb-3">You can see people, but you can't connect until you verify your ID.</p>
             <Link href="/verify-id">
                 <button className="text-xs font-bold underline">Verify Now -</button>
             </Link>
          </div>
      )}

      {/* --- THE CARDS (Bulletin Board Style) --- */}
      <div className="space-y-6 max-w-md mx-auto">
        
        {matches.length === 0 && (
            <div className="text-center py-10 opacity-50">
                <p className="font-hand text-2xl">No one here yet...</p>
                <div className="text-4xl mt-2">🍃</div>
            </div>
        )}

        {matches.map((match: any, index: number) => {
            // Randomize rotation slightly for organic feel
            const rotation = index % 2 === 0 ? 'rotate-1' : 'rotate-[-1deg]';
            
            // Time Logic
            let displayTime = match.startTime;
            let isLive = false;
            if (match.todaysTime && match.lastStatusUpdate) {
                const statusDate = new Date(match.lastStatusUpdate);
                const today = new Date();
                if (statusDate.getDate() === today.getDate() && statusDate.getMonth() === today.getMonth()) {
                    displayTime = match.todaysTime;
                    isLive = true;
                }
            }

            return (
            <div key={match.clerkId} className={`paper-card p-5 relative ${rotation} bg-white transition-transform hover:z-10`}>
                
                {/* Tape at the top */}
                <div className="tape"></div>

                {/* Card Content */}
                <div className="flex items-start justify-between mb-4 mt-2">
                    <div className="flex items-center gap-3">
                        <img src={match.imageUrl} className="w-14 h-14 rounded-full border-2 border-slate-900 object-cover bg-slate-100" />
                        <div>
                            <h3 className="font-hand text-2xl font-bold text-slate-900 leading-none">
                                {match.firstName}
                            </h3>
                            <span className="text-[10px] font-mono border border-slate-400 px-1 rounded bg-slate-50 text-slate-500">
                                FROM: {match.homeStation}
                            </span>
                        </div>
                    </div>

                    {/* Time Stamp (Looks like a stamp) */}
                    <div className={`text-right ${!isVerified ? "blur-sm opacity-50 select-none" : ""}`}>
                        <div className={`border-2 border-slate-900 px-2 py-1 rounded-lg transform rotate-[-3deg] ${isLive ? "bg-green-100" : "bg-slate-100"}`}>
                            <span className="font-mono text-sm font-bold text-slate-900">{displayTime}</span>
                        </div>
                        {isLive && <p className="font-hand text-xs text-green-600 font-bold mt-1">Live!</p>}
                    </div>
                </div>

                {/* Bio (Handwritten Note) */}
                {match.bio && (
                    <div className="mb-4 bg-yellow-50 p-3 border-l-2 border-slate-300 font-hand text-lg text-slate-700 leading-tight">
                        "{match.bio}"
                    </div>
                )}

                {/* Footer / Connect */}
                <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-slate-400">
                        CONNECTIONS: {match.friends?.length || 0}
                    </span>

                    {isVerified ? (
                        (() => {
                            if (match.isFriend) return <span className="font-hand font-bold text-green-600 text-lg">Friends! ✓</span>;
                            if (match.hasIncomingRequest) return <Link href="/mates"><button className="btn-sketch px-4 py-1 text-sm font-bold">Accept Request</button></Link>;
                            return <ConnectButton receiverId={match.clerkId} isPending={match.hasPendingRequest} />;
                        })()
                    ) : (
                        <Link href="/verify-id">
                            <span className="font-hand font-bold text-slate-400 text-sm hover:text-blue-500">🔒 Verify to add</span>
                        </Link>
                    )}
                </div>

            </div>
        )})}
      </div>
    </div>
  );
}