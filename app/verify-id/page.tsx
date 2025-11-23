"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { UploadDropzone } from "@/utils/uploadthing"; 
import { useState } from "react";
// IMPORT THE NEW ACTION 👇
import { updateIdCard } from "@/actions/user.actions";

export default function VerifyIDPage() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploaded">("idle");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      
      {/* Background Effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

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

        {/* --- THE REAL UPLOADER (Cleaned Up) --- */}
        <div className="relative z-20">
            
            {uploadStatus === "idle" ? (
                <UploadDropzone
                    endpoint="idCardImage"
                    // 1. Container Styling: Matches your original dark card exactly
                    appearance={{
                        container: "bg-gray-900/80 border-2 border-dashed border-gray-700 rounded-2xl h-64 flex flex-col justify-center hover:bg-gray-800 transition-colors cursor-pointer shadow-2xl backdrop-blur-sm p-0 overflow-hidden",
                        label: "text-gray-200 font-semibold text-base mt-2",
                        allowedContent: "text-gray-500 text-xs",
                        button: "bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg mt-4",
                    }}
                    // 2. Custom Content: Takes YOUR icon and text
                    content={{
                        uploadIcon: (
                           <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                              <span className="text-3xl">📷</span>
                           </div>
                        ),
                        label: "Tap to Upload Image",
                        allowedContent: "Supports JPG, PNG (Max 4MB)"
                    }}
                    onClientUploadComplete={async (res) => {
                        // 1. Log the file URL
                        const fileUrl = res[0].url;
                        console.log("File URL:", fileUrl);
                        
                        // 2. Save it to MongoDB
                        await updateIdCard(fileUrl);

                        // 3. Show Success
                        alert("Upload Completed! ID saved to profile.");
                        setUploadStatus("uploaded");
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                    }}
                />
            ) : (
                // Success State
                <div className="bg-gray-900/80 border border-gray-700 rounded-2xl h-64 flex flex-col items-center justify-center text-green-400 shadow-2xl backdrop-blur-sm">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold">Upload Successful!</h3>
                    <p className="text-gray-400 text-sm mt-2">Verification in progress.</p>
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
        
        {/* Footer Actions (Your original Link) */}
        <div className="mt-8 flex justify-between items-center px-2">
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Back to Sign In
          </Link>
          
          <div className="flex items-center gap-2">
             <span className="text-xs text-gray-600 uppercase">Signed in as guest</span>
             <UserButton afterSignOutUrl="/" /> 
          </div>
        </div>

      </div>
    </div>
  );
}