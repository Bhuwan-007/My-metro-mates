export const dynamic = 'force-dynamic';

import { createUser, getMatches } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import ConnectButton from "@/components/ConnectButton";
import FilterBar from "@/components/FilterBar";

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
    <div className="min-h-screen p-6 pb-32 font-sans overflow-x-hidden bg-(--bg-paper) transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <div className="relative mb-8 text-center -rotate-1">
        <div className="inline-block relative">
            {/* Dark Mode: Text becomes White */}
            <h1 className="font-kalam text-5xl font-bold  relative z-10 drop-shadow-sm transition-colors">
                Find Travelers
            </h1>
            {/* Highlighter: Blue -> Dark Blue */}
            <div className="absolute bottom-2 left-0 w-full h-4 bg-[#b3e5fc] dark:bg-blue-900/50 z-0 transform -rotate-2"></div>
        </div>
        <p className="font-hand text-xl mt-1 transition-colors">
            Going to <span className="font-bold font-kalam underline decoration-wavy decoration-green-500 dark:decoration-green-800 ">{user.collegeStation}</span>
        </p>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="mb-8 rotate-1">
         <FilterBar />
      </div>
      
      {/* --- UNVERIFIED WARNING --- */}
      {!isVerified && (
          <div className="mb-8 mx-auto max-w-sm bg-red-50 dark:bg-red-900/20 border-2 border-red-800 dark:border-red-500 border-dashed p-4 -rotate-1 shadow-sm relative transition-colors">
             <div className="absolute -top-3 -left-3 w-8 h-8 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-white font-bold">!</div>
             <p className="font-hand text-xl font-bold text-red-800 dark:text-red-400">Guest Mode</p>
             <p className="text-sm font-sans mb-3 text-red-900 dark:text-red-200">Times are hidden until you verify your ID.</p>
             <Link href="/verify-id">
                 <button className="text-xs font-bold underline text-red-700 dark:text-red-300 hover:text-red-900 cursor-pointer">Verify Now</button>
             </Link>
          </div>
      )}

      {/* --- THE CARDS --- */}
      <div className="space-y-6 max-w-md mx-auto">
        
        {matches.length === 0 && (
            <div className="text-center py-10 opacity-50">
                <p className="font-hand text-2xl dark:text-slate-400">No one here yet...</p>
                <div className="text-4xl mt-2">🍃</div>
            </div>
        )}

        {matches.map((match: any, index: number) => {
            const rotation = index % 2 === 0 ? 'rotate-1' : 'rotate-[-1deg]';
            
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
            // 🎨 CARD BG: bg-white -> dark:bg-slate-800
            <div key={match.clerkId} className={`paper-card p-5 relative ${rotation} bg-white dark:bg-slate-800 transition-all duration-300 hover:z-10`}>
                
                {/* Tape: Adjusted transparency for dark mode */}
                <div className="tape dark:bg-white/10 dark:border-white/20"></div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 mt-2 gap-3">
                    <div className="flex items-center gap-3">
                        <img src={match.imageUrl} className="w-14 h-14 rounded-full border-2 border-slate-900 dark:border-slate-500 object-cover bg-slate-100" />
                        <div>
                            {/* NAME: Dark -> White */}
                            <h3 className="font-hand text-2xl font-bold  leading-none">
                                {match.firstName}
                            </h3>
                            {/* TAG: Slate-50 -> Slate-700 */}
                            <span className="text-[14px] font-mono border border-(--text-muted) px-1 rounded opacity-70">
                                FROM: {match.homeStation}
                            </span>
                        </div>
                    </div>

                    {/* --- TIME STAMP --- */}
                    <div className="self-end sm:self-auto text-right shrink-0 w-fit ml-auto">
                        {isVerified && displayTime ? (
                            <>
                                {/* Time Box: Slate-100 -> Slate-700 */}
                                <div className={`border-2 border-slate-900 dark:border-slate-400 px-2 py-1 rounded-lg transform -rotate-3 ${isLive ? "bg-green-100 dark:bg-green-900/40" : "bg-slate-100 dark:bg-slate-700"}`}>
                                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{displayTime}</span>
                                </div>
                                {isLive && <p className="font-hand text-xs text-green-600 dark:text-green-400 font-bold mt-1">Live!</p>}
                            </>
                        ) : (
                            // Locked State
                            <div className="border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg transform -rotate-3 opacity-80 flex items-center gap-1 cursor-not-allowed" title="Verify ID to see time">
                                <span className="font-mono text-sm font-bold text-slate-400 dark:text-slate-500">Locked</span>
                                <span className="text-xs">🔒</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* BIO: Yellow Note -> Dark Translucent Note */}
                {match.bio && (
                    <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/10 p-3 border-l-2 border-slate-300 dark:border-slate-600 font-hand text-lg text-slate-700 leading-tight">
                        "{match.bio}"
                    </div>
                )}

                {/* --- FOOTER --- */}
                <div className="pt-3 border-t-2 border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        CONNECTIONS: {match.friendsCount || 0}
                    </span>

                    {isVerified ? (
                        (() => {
                            if (match.isFriend) return <span className="font-hand font-bold text-green-600 dark:text-green-400 text-lg">Friends! ✓</span>;
                            if (match.hasIncomingRequest) return <Link href="/mates"><button className="btn-sketch px-4 py-1 text-sm font-bold">Accept Request</button></Link>;
                            return <ConnectButton receiverId={match.clerkId} isPending={match.hasPendingRequest} />;
                        })()
                    ) : (
                        <Link href="/verify-id">
                            <button className="flex items-center gap-1 font-hand font-bold text-slate-400 dark:text-slate-500 text-sm hover:text-blue-500 transition-colors">
                                <span>Add Friend</span>
                                <span className="text-xs">🔒</span>
                            </button>
                        </Link>
                    )}
                </div>

            </div>
            )
        })}
      </div>
    </div>
  );
}