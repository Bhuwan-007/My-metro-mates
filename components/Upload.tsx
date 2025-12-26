"use client";

import { UploadDropzone } from "@/utils/uploadthing"; 
import { useState } from "react";
import { updateIdCard } from "@/actions/user.actions"; 
import { useRouter } from "next/navigation";

export default function UploadCard() {
  const router = useRouter(); 
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploaded">("idle");

  return (
    <div className="w-full">
        {/* --- THE UPLOADER (Styled for Scrapbook) --- */}
        <div className="relative z-20">
            {uploadStatus === "idle" ? (
                <UploadDropzone
                    endpoint="idCardImage"
                    config={{ mode: "auto" }} 
                    appearance={{
                        // 🎨 RESTYLED: Dashed border, Light background, Black text
                        container: "bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl h-52 flex flex-col justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer overflow-hidden",
                        label: "text-slate-600 dark:text-slate-300 font-bold text-sm mt-2",
                        allowedContent: "text-slate-400 dark:text-slate-500 text-xs",
                        button: "bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-2 rounded-lg mt-4 pointer-events-none",
                    }}
                    content={{
                        uploadIcon: (
                            // ✅ ADDED DARK MODE TO ICON CIRCLE
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center mb-1">
                                <span className="text-2xl">📷</span>
                            </div>
                        ),
                        label: "Tap to Take Photo / Upload",
                        allowedContent: "JPG, PNG (Max 4MB)"
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
                // ✅ SUCCESS STATE (Added Dark Mode Support)
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl h-52 flex flex-col items-center justify-center text-green-700 dark:text-green-400 animate-in fade-in zoom-in">
                    <div className="text-5xl mb-2">✅</div>
                    <h3 className="text-lg font-black">Upload Complete!</h3>
                    <p className="text-xs">Updating status...</p>
                </div>
            )}
        </div>
    </div>
  );
}