import { createUser } from "@/actions/user.actions";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Get User Data
  const user = await createUser();

  // 2. Security Checks
  if (!user) redirect("/");
  if (!user.onboarded) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      {/* --- NAVBAR --- */}
      <div className="relative z-10 flex items-center justify-between max-w-4xl mx-auto py-6 mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">🚇</span> 
          <span>My Metro <span className="text-blue-500">Mates</span></span>
        </h1>
        <div className="bg-white/10 p-1 pr-4 rounded-full flex items-center gap-3">
            <div className="scale-75"><UserButton afterSignOutUrl="/"/></div>
            <span className="text-sm font-medium hidden sm:block">{user.firstName}</span>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
        
        {/* CARD 1: My Travel Profile */}
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl backdrop-blur-md">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-gray-400 text-sm uppercase tracking-wider font-semibold">My Route</h2>
                    <div className="text-3xl font-bold mt-1 text-white">{user.startTime}</div>
                </div>
                {/* Edit Button */}
                <Link href="/onboarding">
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 cursor-pointer px-3 py-1 rounded-full text-gray-300 transition-colors">
                        Edit ✎
                    </button>
                </Link>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                    <div>
                        <p className="text-xs text-gray-500">Home Station</p>
                        <p className="font-medium text-lg">{user.homeStation}</p>
                    </div>
                </div>
                
                {/* The Connector Line */}
                <div className="h-8 w-0.5 bg-gradient-to-b from-blue-500 to-pink-500 ml-1 opacity-30"></div>

                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
                    <div>
                        <p className="text-xs text-gray-500">College Station</p>
                        <p className="font-medium text-lg">{user.collegeStation}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* CARD 2: Stats & Action */}
        <div className="flex flex-col gap-6">
            
            {/* Status Card */}
            <div className="flex-1 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                <div className="text-5xl mb-2">👋</div>
                <h3 className="text-xl font-bold">You are ready!</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                    Your profile is visible to other students going to <strong>{user.collegeStation}</strong>.
                </p>
            </div>

            {/* THE BIG BUTTON */}
            <Link href="/search" className="group">
                <button className="w-full bg-white text-black text-xl font-bold py-6 rounded-3xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3">
                    <span>🔍</span> Find Travel Partners
                </button>
            </Link>

        </div>
      </div>
      
      {/* Footer Info */}
      <div className="text-center text-gray-600 text-xs mt-12">
        You are part of the exclusive IP University network.
      </div>

    </div>
  );
}