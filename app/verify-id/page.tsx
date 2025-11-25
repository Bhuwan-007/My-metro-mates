import { createUser } from "@/actions/user.actions"; 
import UploadCard from "@/components/Upload"; 
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation"; // <--- 1. Import redirect

export default async function VerifyIDPage() {
  // 1. Fetch user data
  const dbUser = await createUser();

  // 2. SAFETY CHECK: If not logged in, kick them to Home
  if (!dbUser) {
    redirect("/"); // <--- THE FIX
  }

  // 3. CHECK: Has this user already uploaded an ID?
  const hasUploaded = dbUser && dbUser.idCardUrl && dbUser.idCardUrl.length > 0;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      {hasUploaded ? (
        
        // --- VIEW A: ALREADY UPLOADED ---
        <div className="relative z-10 w-full max-w-lg p-6">
            <div className="bg-gray-900/90 border border-yellow-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                    <span className="text-4xl">⏳</span>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-white">Verification Pending</h1>
                <p className="text-gray-400 mb-6">
                    You have already uploaded an ID Card. <br/>
                    Please wait for the admin to approve your request.
                </p>
                <div className="bg-black/40 rounded-lg p-3 text-sm text-yellow-500 font-mono border border-yellow-500/20 mb-6">
                    Status: UNDER REVIEW
                </div>
                
                <SignOutButton redirectUrl="/">
                    <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                        Sign Out & Check Later
                    </button>
                </SignOutButton>
            </div>
        </div>

      ) : (
        
        // --- VIEW B: NOT UPLOADED YET ---
        <UploadCard rejectionReason={dbUser?.rejectionReason} />
        
        
      )}
    </div>
  );
}