"use client";

import { removeFriend } from "@/actions/request.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactLink from "@/components/ContactLink";
import InfoTooltip from "@/components/InfoTooltip";


export default function FriendButtons({ friendId, contactMethod, contactValue }: { friendId: string, contactMethod: string, contactValue: string }) {
  const router = useRouter();
  
  // State to track the button's behavior
  const [status, setStatus] = useState<"idle" | "confirming" | "removing">("idle");

  const handleRemoveClick = async () => {
    // Step 1: First click -> Ask for confirmation
    if (status === "idle") {
      setStatus("confirming");
      // Auto-reset after 3 seconds if they don't click again
      setTimeout(() => setStatus("idle"), 3000);
    } 
    // Step 2: Second click -> Actually remove
    else if (status === "confirming") {
      setStatus("removing");
      await removeFriend(friendId);
      router.refresh();
      // No need to setStatus back because the component will likely unmount/refresh
    }
  };

  if (status === "removing") return <span className="text-xs text-red-500 animate-pulse">Disconnecting...</span>;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-1">
        {/* Contact Button */}
          <ContactLink
            method={contactMethod}
            value={contactValue}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-transform active:scale-95 ${
              contactMethod === 'whatsapp' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' 
                : 'bg-pink-500/10 text-pink-400 border border-pink-600/20 hover:bg-pink-500/20'
            }`}
          >
            {contactMethod === 'whatsapp' ? 'WhatsApp' : 'Instagram'} ↗
            {contactMethod === 'instagram' && <InfoTooltip />}
        </ContactLink>
      </div>
        {/* Smart Unfriend Button */}
        <button 
            onClick={handleRemoveClick}
            className={`p-1 text-[12px] transition-all duration-200 hover:cursor-pointer ${
                status === "confirming" 
                ? "text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-full" 
                : "text-zinc-400 hover:text-red-500"
            }`}
        >
            {status === "confirming" ? "Tap again to Confirm 🗑️" : "Remove Connection"}
        </button>
    </div>
  );
}