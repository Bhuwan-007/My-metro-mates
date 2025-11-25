import { createUser, getMatches } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import ConnectButton from "@/components/ConnectButton";
import FilterBar from "@/components/FilterBar";

// 1. Updated to accept searchParams for filtering
export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ time?: string, gender?: string, mode?: string }> // <--- ADDED MODE
}) {
  
  // 2. Await the params
  const params = await searchParams;

  const user = await createUser();
  if (!user) redirect("/");
  if (!user.onboarded) redirect("/onboarding");

  // 3. Pass filters to the backend
  const matches = await getMatches(
      user.clerkId, 
      params.time === "true", 
      params.gender,
      params.mode
  );
  
  const requestCount = user.friendRequests?.length || 0;

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans selection:bg-blue-500/30">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="relative z-10 px-6 pt-10 pb-4 max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <span className="text-blue-500 text-xs font-bold tracking-[0.2em] uppercase mb-1 block">Target Sector</span>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">
              {user.collegeStation}
            </h1>
            <p className="text-zinc-500 text-sm mt-1 font-mono">
              // {matches.length} SIGNALS DETECTED
            </p>
        </div>
        <Link href="/mates" className="group flex items-center gap-3 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-blue-500/50 transition-all">
            <span className="text-sm font-bold text-zinc-300 group-hover:text-white">My Network</span>
            
            {/* Notification Logic */}
            {requestCount > 0 ? (
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse">
                    {requestCount} NEW
                </span>
            ) : (
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            )}
        </Link>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="relative z-10 px-6 mb-8 max-w-6xl mx-auto">
         <FilterBar />
      </div>

      {/* --- THE GRID LAYOUT --- */}
      <div className="relative z-10 px-6 max-w-6xl mx-auto">
        
        {matches.length === 0 && (
            <div className="py-32 text-center border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-600 font-mono">NO_SIGNALS_FOUND_IN_VICINITY</p>
                <p className="text-zinc-700 text-xs mt-2">Try adjusting filters.</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match: any) => {
                
                // --- 🕒 LIVE TIME LOGIC ---
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
                // ---------------------------

                return (
                <div key={match.clerkId} className="group relative h-[240px] bg-[#050505] border border-zinc-800 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    
                    {/* 1. THE SILHOUETTE */}
                    <div className="absolute right-[-20px] bottom-[-20px] w-[180px] h-[180px] transition-all duration-500 group-hover:scale-105 opacity-40 group-hover:opacity-100">
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <path d="M100 180 C 100 180, 140 180, 160 140 C 170 120, 160 90, 130 90 C 130 90, 140 60, 130 40 C 120 20, 90 20, 80 40 C 70 60, 80 90, 80 90 C 50 90, 40 120, 50 140 C 70 180, 100 180, 100 180 Z" stroke="currentColor" strokeWidth="2" className="text-zinc-700 group-hover:text-blue-400 transition-colors duration-500" filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="110" y="100" width="20" height="35" rx="2" stroke="currentColor" strokeWidth="2" transform="rotate(-15 120 117)" className="text-zinc-700 group-hover:text-blue-400 transition-colors duration-500"/>
                        </svg>
                    </div>

                    {/* 2. THE CONTENT */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                        
                        {/* Top: Name & Route */}
                        <div>
                            <div className="flex items-start gap-3 mb-3">
                                <img src={match.imageUrl} alt={match.firstName} className="w-10 h-10 rounded-lg border border-zinc-700 bg-zinc-800 object-cover" />
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                        {match.firstName} {match.lastName}
                                    </h3>
                                    <span className="text-[9px] bg-blue-900/40 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded tracking-wider font-bold uppercase">Student</span>
                                </div>
                            </div>
                            <div className="space-y-1 mb-3">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">From Station</p>
                                <p className="text-sm text-zinc-300 font-medium truncate max-w-[180px]">{match.homeStation}</p>
                            </div>
                            {match.bio && (
                                <p className="text-xs text-zinc-500 italic line-clamp-2 max-w-[200px]">"{match.bio}"</p>
                            )}
                        </div>

                        {/* Bottom: Stats & Action */}
                        <div className="flex items-end justify-between mt-2">
                            
                            {/* Left: Stats (WITH LIVE TIME) */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs font-mono">
                                    <span className={isLive ? "text-blue-400 font-bold" : "text-zinc-400"}>
                                        {isLive ? "🔴" : "🕒"} {displayTime}
                                    </span>
                                    {isLive && <span className="text-[8px] bg-blue-900/50 text-blue-200 px-1 rounded border border-blue-800 animate-pulse">NOW</span>}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                                    <span>🔗</span> <span>{match.friends?.length || 0} companions</span>
                                </div>
                            </div>
                            
                            {/* SMART BUTTONS */}
                            {(() => {
                                if (match.isFriend) {
                                    return (
                                        <button disabled className="bg-green-900/20 border border-green-900 text-green-400 px-4 py-2 rounded-lg text-[10px] font-extrabold tracking-wide cursor-default flex items-center gap-2 uppercase shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                                            <span>🤝</span> Companion
                                        </button>
                                    );
                                } 
                                else if (match.hasIncomingRequest) {
                                    return (
                                        <Link href="/mates">
                                            <button className="bg-yellow-900/20 border border-yellow-700 text-yellow-500 px-4 py-2 rounded-lg text-[10px] font-extrabold tracking-wide flex items-center gap-2 uppercase hover:bg-yellow-900/40 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                                                <span>📬</span> Accept
                                            </button>
                                        </Link>
                                    );
                                } 
                                else {
                                    return (
                                        <ConnectButton 
                                            receiverId={match.clerkId} 
                                            isPending={match.hasPendingRequest} 
                                        />
                                    );
                                }
                            })()}
                        </div>

                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none"></div>
                </div>
            )})}
        </div>

      </div>

      {/* --- BOTTOM DOCK --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-[#111]/90 backdrop-blur-md border border-zinc-800 p-1.5 rounded-full shadow-2xl">
            <Link href="/dashboard" className="p-3 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>
            <Link href="/mates" className="relative p-3 rounded-full bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                {requestCount > 0 && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-blue-600"></span>
                )}
            </Link>
        </div>
      </div>

    </div>
  );
}