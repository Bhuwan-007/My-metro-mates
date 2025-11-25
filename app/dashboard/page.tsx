import { createUser } from "@/actions/user.actions";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusWidget from "@/components/StatusWidget";
import BioWidget from "@/components/BioWidget";

export default async function DashboardPage() {
  // 1. Get User Data
  const user = await createUser();

  // 2. Security Checks
  if (!user) redirect("/");
  if (!user.onboarded) redirect("/onboarding");
  // LOGIC: Check if "todaysTime" is fresh (set within the last 24 hours)
  let activeTime = ""; // This will hold the temporary time if valid

  if (user.todaysTime && user.lastStatusUpdate) {
        const statusDate = new Date(user.lastStatusUpdate);
        const today = new Date();

        // Check if it's the same day (Simple check)
    if (statusDate.getDate() === today.getDate() && statusDate.getMonth() === today.getMonth()) {
            activeTime = user.todaysTime;
        }
    }

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans selection:bg-blue-500/30">
      
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      {/* --- NAVBAR --- */}
      <div className="relative z-10 flex items-center justify-between max-w-4xl mx-auto py-6 mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">🚇</span> 
          <span>My Metro <span className="text-blue-500">Mates</span></span>
        </h1>
        {/* User Pill */}
        <div className="bg-white/10 p-1 sm:pr-4 rounded-full flex items-center gap-3 border border-white/5">
            {/* Added 'flex' to the wrapper to ensure the button sits tight */}
            <div className="scale-75 flex">
                <UserButton/>
            </div>
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
                    {/* REPLACED STATIC TIME WITH WIDGET 👇 */}
                    <div className="mt-1">
                        <StatusWidget 
                            currentStatus={activeTime} 
                            defaultTime={user.startTime} 
                        />
                    </div>
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
            {/* --- BIO WIDGET (Editable) --- */}
        <BioWidget initialBio={user.bio || ""} />
        </div>

        {/* CARD 2: Stats & Action */}
        <div className="flex flex-col gap-6">
            
            {/* Status Card */}
            <div className="flex-1 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                <div className="text-5xl mb-2">👋</div>
                <h3 className="text-xl font-bold">You are ready!</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                    Your profile is visible to other students travelling through your route.
                </p>
            </div>

            {/* THE BIG BUTTON */}
            <Link href="/search" className="group">
                <button className="w-full bg-white text-black text-xl font-bold py-6 rounded-3xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3">
                    <span>🔍</span> Find Travel Partners
                </button>
            </Link>

            {/* Footer Info */}
            <div className="text-center mt-12 pb-8">
                <Link href="/about" className="inline-block group">
                    <p className="text-zinc-600 text-xs font-medium mb-1 group-hover:text-zinc-400 transition-colors">
                        Designed & Built by <span className="text-zinc-300 underline decoration-zinc-700 group-hover:decoration-blue-500">Bhuwan Chugh</span>
                    </p>
                    <p className="text-[10px] text-zinc-700 font-mono">
                        v1.0 • IP University
                    </p>
                </Link>
            </div>

        </div>
      </div>

    </div>
  );
}