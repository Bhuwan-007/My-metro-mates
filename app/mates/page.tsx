import { createUser, getMyMates } from "@/actions/user.actions"; // Fixed import path (singular .action)
import { redirect } from "next/navigation";
import Link from "next/link";
import RequestButtons from "@/components/RequestButtons";
import FriendButtons from "@/components/FriendButtons";

export default async function MatesPage() {
  const user = await createUser();
  if (!user) redirect("/");

  const { requests, friends } = await getMyMates(user.clerkId);

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6 max-w-2xl mx-auto">
        <Link href="/search" className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4 block hover:text-white transition-colors">
          ← Back to Search
        </Link>
        <h1 className="text-4xl font-black text-white tracking-tight">
          My Network
        </h1>
      </div>

      <div className="relative z-10 px-4 max-w-2xl mx-auto space-y-10">
        
        {/* --- SECTION 1: PENDING REQUESTS --- */}
        <div>
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-4 px-2">
                Incoming Signals ({requests.length})
            </h2>

            {requests.length === 0 ? (
                <div className="p-6 rounded-3xl border border-zinc-900 bg-zinc-900/30 text-zinc-500 text-sm text-center">
                    No pending requests.
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req: any) => (
                        <div key={req.clerkId} className="bg-[#0A0A0A] border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={req.imageUrl} className="w-12 h-12 rounded-full bg-zinc-800 object-cover" />
                                <div>
                                    <h3 className="font-bold text-white">{req.firstName} {req.lastName}</h3>
                                    <p className="text-xs text-zinc-500 mb-1">{req.homeStation} • {req.startTime}</p>
                                    <a 
                                        href={req.contactMethod === 'whatsapp' ? `https://wa.me/${req.contactValue}` : `https://instagram.com/${req.contactValue}`}
                                        target="_blank"
                                        className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 hover:text-white hover:border-zinc-500 transition-colors flex items-center gap-1 w-fit"
                                    >
                                        <span>🔍</span> Check {req.contactMethod === 'whatsapp' ? 'Number' : 'Social'}
                                    </a>
                                </div>
                            </div>
                            <RequestButtons senderId={req.clerkId} />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- SECTION 2: MY SQUAD --- */}
        <div>
            <h2 className="text-sm font-bold text-green-500 uppercase tracking-wider mb-4 px-2">
                Connected ({friends.length})
            </h2>

            {friends.length === 0 ? (
                <div className="p-8 rounded-3xl border border-dashed border-zinc-800 text-center">
                    <div className="text-4xl mb-2 opacity-30">🤝</div>
                    <p className="text-zinc-500 text-sm">You haven't connected with anyone yet.</p>
                    <Link href="/search" className="text-blue-400 text-sm font-bold mt-2 inline-block hover:underline">Find People →</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {friends.map((friend: any) => {
                        
                        // --- 🕒 TIME CHECK LOGIC ---
                        let displayTime = friend.startTime;
                        let isLive = false;

                        if (friend.todaysTime && friend.lastStatusUpdate) {
                            const statusDate = new Date(friend.lastStatusUpdate);
                            const today = new Date();
                            // Check if update matches TODAY's date
                            if (statusDate.getDate() === today.getDate() && statusDate.getMonth() === today.getMonth()) {
                                displayTime = friend.todaysTime;
                                isLive = true; // Mark as Live!
                            }
                        }
                        // ---------------------------

                        return (
                            <div key={friend.clerkId} className={`border p-5 rounded-3xl transition-all ${isLive ? 'bg-blue-900/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar with optional Live Ring */}
                                        <div className={`relative rounded-xl p-[2px] ${isLive ? 'bg-blue-500 animate-pulse' : ''}`}>
                                            <img src={friend.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-zinc-900" />
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-bold text-white">{friend.firstName}</h3>
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                                {/* Station Badge */}
                                                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded w-fit">
                                                    {friend.homeStation}
                                                </span>

                                                {/* TIME BADGE (Dynamic) */}
                                                <span className={`text-xs px-2 py-0.5 rounded w-fit font-mono font-bold flex items-center gap-1 ${isLive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-zinc-800 text-zinc-500'}`}>
                                                    {isLive && <span className="animate-bounce">📍</span>}
                                                    {displayTime}
                                                    {isLive && <span className="text-[9px] opacity-80 ml-1">TODAY</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <FriendButtons 
                                            friendId={friend.clerkId} 
                                            contactMethod={friend.contactMethod} 
                                            contactValue={friend.contactValue} 
                                        />
                                    </div>
                                </div>
                                {friend.bio && (
                                    <p className="text-sm text-zinc-500 italic">"{friend.bio}"</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

      </div>
      
      {/* Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-[#111]/90 backdrop-blur-md border border-zinc-800 p-1.5 rounded-full shadow-2xl">
            <Link href="/dashboard" className="p-3 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>
            <Link href="/mates" className="p-3 rounded-full bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </Link>
        </div>
      </div>

    </div>
  );
}