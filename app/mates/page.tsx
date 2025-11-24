import { createUser, getMyMates } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";

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
                            
                            {/* Person Info */}
                            <div className="flex items-center gap-3">
                                <img src={req.imageUrl} className="w-12 h-12 rounded-full bg-zinc-800 object-cover" />
                                <div>
                                    <h3 className="font-bold text-white">{req.firstName} {req.lastName}</h3>
                                    <p className="text-xs text-zinc-500">{req.homeStation} • {req.startTime}</p>
                                </div>
                            </div>

                            {/* Action Buttons (We will wire these next!) */}
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-all">
                                    ✕
                                </button>
                                <button className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-900/20 transition-all">
                                    ✓
                                </button>
                            </div>
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
                    {friends.map((friend: any) => (
                        <div key={friend.clerkId} className="bg-zinc-900/50 border border-zinc-800/50 p-5 rounded-3xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={friend.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                                    <div>
                                        <h3 className="font-bold text-white">{friend.firstName}</h3>
                                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                                            {friend.homeStation}
                                        </span>
                                    </div>
                                </div>
                                {/* Contact Button */}
                                <div className="text-right">
                                    <a 
                                        href={friend.contactMethod === 'whatsapp' ? `https://wa.me/${friend.contactValue}` : `https://instagram.com/${friend.contactValue}`}
                                        target="_blank"
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-transform active:scale-95 ${
                                            friend.contactMethod === 'whatsapp' 
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' 
                                            : 'bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20'
                                        }`}
                                    >
                                        {friend.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Instagram'} ↗
                                    </a>
                                </div>
                            </div>
                            {friend.bio && (
                                <p className="text-sm text-zinc-500 italic">"{friend.bio}"</p>
                            )}
                        </div>
                    ))}
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