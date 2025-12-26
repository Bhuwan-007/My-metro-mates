import { createUser } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UploadCard from "@/components/Upload"; 
import { Kalam } from "next/font/google";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache"; // <--- IMPORT THIS

const kalam = Kalam({ weight: '700', subsets: ["latin"] });

export default async function VerifyIDPage() {
  // 🛑 FORCE FRESH DATA: Prevents the "Old User" cache issue
  noStore(); 

  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await createUser();
  if (!dbUser) redirect("/");

  // --- DEBUGGING LOGIC ---
  const idCardUrl = dbUser.idCardUrl || "";
  const rejectionReason = dbUser.rejectionReason || "";
  const isVerified = dbUser.isVerified === true; // Ensure strict boolean

  // 1. Is the user Verified? (Top Priority)
  if (isVerified) {
    return <VerifiedView />;
  }

  // 2. Is the user Rejected? (Needs to see error & re-upload)
  const isRejected = rejectionReason.length > 0;

  // 3. Is the user Pending? (Uploaded + Not Verified + Not Rejected)
  const isPending = idCardUrl.length > 0 && !isRejected;

  return (
    <div className="min-h-screen p-6 pb-32 flex flex-col items-center justify-center font-sans bg-[#F0F4F8] dark:bg-[#0f172a] transition-colors duration-300"
         style={{backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '30px 30px'}}>
      
      {/* HEADER */}
      <div className="text-center mb-8 -rotate-1">
        <h1 className={`${kalam.className} text-5xl text-slate-900 dark:text-white mb-2 drop-shadow-sm`}>
           Verify Identity
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-bold">Unlock full access to the metro network!</p>
      </div>

      {/* PAPER CARD */}
      <div className="paper-card bg-white dark:bg-slate-800 p-6 max-w-md w-full relative rotate-1 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] border-4 border-black dark:border-white transition-colors duration-300">
        <div className="tape dark:bg-yellow-500/20 dark:border-yellow-500/40"></div>

        {/* --- LOGIC BRANCHING --- */}
        
        {isPending ? (
            
             /* VIEW: PENDING */
             <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <h2 className={`${kalam.className} text-3xl text-slate-900 dark:text-white mb-2`}>Verification Pending</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 leading-relaxed px-4">
                    You have uploaded your ID. We are reviewing it. <br/>
                    <span className="text-slate-400 dark:text-slate-500 text-xs">(This usually takes 1-2 days)</span>
                </p>
                <div className="inline-block p-3 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-dashed border-yellow-500 rounded-xl text-yellow-800 dark:text-yellow-200 font-bold mb-8">
                    STATUS: UNDER REVIEW
                </div>
                {/* Back Button */}
                <Link href="/dashboard" className="block w-full">
                    <button className="w-full py-3 bg-slate-600 dark:bg-slate-700 text-slate-200 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                        ← Back to Guest Mode
                    </button>
                </Link>
             </div>

        ) : (
            
             /* VIEW: UPLOAD FORM (New or Rejected) */
            <div className="space-y-4">
                
                {isRejected && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-4 border-red-500 p-4 rounded-xl rotate-1 mb-4">
                        <p className={`${kalam.className} text-xl text-red-600 dark:text-red-400`}>❌ Verification Failed</p>
                        <p className="text-red-800 dark:text-red-200 font-bold text-sm mt-1">Reason: "{rejectionReason}"</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">Please upload a clearer photo.</p>
                    </div>
                )}

                {!isRejected && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 mb-4">
                        <p className="text-xs text-blue-800 dark:text-blue-300 font-black mb-1 uppercase">ℹ️ Instructions:</p>
                        <ul className="text-xs text-blue-700 dark:text-blue-200 list-disc pl-4 space-y-1 font-medium">
                            <li>Upload your <b>College ID Card</b>.</li>
                            <li>Name & Photo must be readable.</li>
                        </ul>
                    </div>
                )}
                
                <UploadCard /> 

                <div className="pt-4 border-t-2 border-dashed border-slate-300 dark:border-slate-600">
                    <Link href="/dashboard" className="w-full">
                        <button className="w-full py-4 bg-black dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-black font-bold rounded-xl border-2 border-transparent hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                            <span>← Back to Dashboard</span>
                        </button>
                    </Link>
                </div>

            </div>
        )}

      </div>
    </div>
  );
}

// --- SUB-COMPONENT FOR VERIFIED VIEW (Keeps main component clean) ---
function VerifiedView() {
    return (
        <div className="min-h-screen p-6 flex flex-col items-center justify-center font-sans bg-green-50 dark:bg-[#0f172a] transition-colors duration-300">
            <div className="paper-card bg-white dark:bg-slate-800 p-8 max-w-md w-full relative -rotate-1 shadow-[8px_8px_0px_#16a34a] border-4 border-green-600 dark:border-green-500">
                <div className="tape bg-green-200/50 dark:bg-green-900/30"></div>
                
                <div className="text-center py-6 animate-in zoom-in duration-300">
                    <div className="text-7xl mb-4">🎉</div>
                    <h2 className={`font-bold text-4xl text-green-700 dark:text-green-400 mb-2`}>You're Verified!</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 px-4">
                        Your student status is confirmed. You now have full access to connect with others.
                    </p>
                    
                    <Link href="/dashboard" className="block w-full">
                        <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <span className="text-xl">🚀</span>
                            <span>ENTER DASHBOARD</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}