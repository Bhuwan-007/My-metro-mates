export const dynamic = 'force-dynamic';

import { createUser, getMyMates } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import RequestButtons from "@/components/RequestButtons";
import FriendButtons from "@/components/FriendButtons";
import RefreshButton from "@/components/RefreshButton";

export default async function MatesPage() {
  const user = await createUser();
  if (!user) redirect("/");

  const { requests, friends } = await getMyMates(user.clerkId);

  return (
    <div className="min-h-screen p-6 pb-32 font-sans overflow-x-hidden">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-hand text-5xl font-bold text-slate-900 inline-block relative">
           My Scrapbook
           {/* Underline Scribble */}
           <svg className="absolute w-full h-3 -bottom-2 left-0 text-yellow-300" viewBox="0 0 100 10" preserveAspectRatio="none">
             <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
           </svg>
        </h1>
      </div>

      <div className="max-w-md mx-auto space-y-10">
        
        {/* --- SECTION 1: INCOMING REQUESTS --- */}
        <div>
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="font-hand text-2xl font-bold text-black highlight-yellow inline-block">
                    Sticky Notes ({requests.length})
                </h2>
                <RefreshButton />
            </div>

            {requests.length === 0 ? (
                <div className="border-2 border-dashed border-slate-300 p-6 rounded-lg text-center text-slate-400 font-hand text-lg rotate-1">
                    No new notes...
                </div>
            ) : (
                <div className="space-y-4">
                    {/* FIXED: Added ': number' to index */}
                    {requests.map((req: any, index: number) => (
                        <div key={req.clerkId} className={`bg-[#fff9c4] p-5 shadow-md relative ${index % 2 === 0 ? 'rotate-1' : '-rotate-2'}`}>
                            <div className="absolute -top-3 left-1/2 w-3 h-3 rounded-full bg-red-500 border border-black"></div>
                            
                            <div className="flex items-center gap-3 mb-3">
                                <img src={req.imageUrl} className="w-10 h-10 rounded-full border border-black grayscale contrast-125" />
                                <div>
                                    <h3 className="font-hand text-xl font-bold leading-none">{req.firstName} {req.lastName}</h3>
                                    <p className="font-mono text-[10px] text-slate-500">Wants to connect</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-2">
                                <RequestButtons senderId={req.clerkId} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- SECTION 2: MY SQUAD --- */}
        <div>
            <h2 className="font-hand text-2xl font-bold text-slate-900 mb-6 px-2 highlight-blue inline-block">
                My Squad ({friends.length})
            </h2>

            {friends.length === 0 ? (
                <div className="text-center py-8">
                    <p className="font-hand text-xl text-black">Page is empty!</p>
                    <Link href="/search" className="underline font-bold text-blue-500">Go find people</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* FIXED: Added ': number' to index */}
                    {friends.map((friend: any, index: number) => {
                        
                        let displayTime = friend.startTime;
                        let isLive = false;
                        if (friend.todaysTime && friend.lastStatusUpdate) {
                            const statusDate = new Date(friend.lastStatusUpdate);
                            const today = new Date();
                            if (statusDate.getDate() === today.getDate() && statusDate.getMonth() === today.getMonth()) {
                                displayTime = friend.todaysTime;
                                isLive = true;
                            }
                        }

                        return (
                            <div key={friend.clerkId} className="flex gap-4 items-start border-b-2 border-slate-200 pb-6">
                                <div className="relative -rotate-2">
                                    <img src={friend.imageUrl} className="w-16 h-16 object-cover border-4 border-white shadow-sm bg-white" />
                                    {isLive && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>}
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="font-kalam text-2xl font-bold text-slate-900 leading-none">{friend.firstName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-mono text-xs bg-slate-100 px-1 rounded border border-slate-300 text-slate-700">{friend.homeStation}</span>
                                        <span className={`text-slate-700 font-mono text-xs px-1 rounded border border-black ${isLive ? 'bg-green-300 font-bold ' : 'bg-white'}`}>
                                            {displayTime}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-3 flex justify-end">
                                        <FriendButtons 
                                            friendId={friend.clerkId} 
                                            contactMethod={friend.contactMethod} 
                                            contactValue={friend.contactValue} 
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}