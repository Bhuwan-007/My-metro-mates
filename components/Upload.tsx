"use client";

import { UserButton, useClerk } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing"; 
import { useState } from "react";
import { updateIdCard } from "@/actions/user.actions"; 
import { useRouter } from "next/navigation";

export default function UploadCard({ rejectionReason }: { rejectionReason?: string }) {
  const { signOut } = useClerk();
  const router = useRouter(); 
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploaded">("idle");

  return (
    <div className="relative z-10 w-full max-w-lg p-6">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-3 rounded-full bg-blue-900/30 border border-blue-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.95 2-2.122 3M16 3h.01M16 7h.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Student Verification</h1>
          <p className="text-gray-400">Upload your College ID Card to unlock access.</p>
        </div>

        {/* --- REJECTION ALERT BOX (Shows if Admin rejected previous attempt) --- */}
        {rejectionReason && (
           <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-left flex gap-3 animate-pulse">
              <div className="text-2xl">⚠️</div>
              <div>
                 <h3 className="font-bold text-red-400 text-sm uppercase">Previous Attempt Rejected</h3>
                 <p className="text-red-200 text-sm mt-1">{rejectionReason}</p>
              </div>
           </div>
        )}

        {/* --- THE UPLOADER --- */}
        <div className="relative z-20">
            {uploadStatus === "idle" ? (
                <UploadDropzone
                    endpoint="idCardImage"
                    config={{ mode: "auto" }} 
                    appearance={{
                        container: "bg-gray-900/80 border-2 border-dashed border-gray-700 rounded-2xl h-64 flex flex-col justify-center hover:bg-gray-800 transition-colors cursor-pointer shadow-2xl backdrop-blur-sm p-0 overflow-hidden",
                        label: "text-gray-200 font-semibold text-base mt-2",
                        allowedContent: "text-gray-500 text-xs",
                        button: "bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg mt-4 pointer-events-none",
                    }}
                    content={{
                        uploadIcon: (
                           <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2"><span className="text-3xl">📷</span></div>
                        ),
                        label: "Tap to Upload Image",
                        allowedContent: "Supports JPG, PNG (Max 4MB)"
                    }}
                    onClientUploadComplete={async (res) => {
                        const fileUrl = res[0].url;
                        await updateIdCard(fileUrl); 
                        setUploadStatus("uploaded");
                        router.refresh(); 
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                    }}
                />
            ) : (
                <div className="bg-gray-900/80 border border-gray-700 rounded-2xl h-64 flex flex-col items-center justify-center text-green-400 shadow-2xl backdrop-blur-sm">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold">Upload Successful!</h3>
                </div>
            )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl flex gap-3">
          <div className="shrink-0 text-blue-400">ℹ️</div>
          <div className="text-sm text-blue-200/80">
            <strong>Manual Approval:</strong> Our team reviews every ID. Approval usually takes 2-4 hours.
          </div>
        </div>
        
        {/* --- FOOTER ACTIONS (This is the Exit Door!) --- */}
        <div className="mt-8 flex justify-between items-center px-2">
          <button 
            onClick={() => signOut({ redirectUrl: '/' })}
            className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1 cursor-pointer"
          >
              <span>←</span> Sign Out & Return Home
          </button>
          
          <div className="flex items-center gap-2">
             <span className="text-xs text-gray-600 uppercase">Guest</span>
             <UserButton /> 
          </div>
        </div>
    </div>
  );
}