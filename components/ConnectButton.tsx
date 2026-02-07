"use client";

import { useState } from "react";
import { sendFriendRequest, cancelSentRequest } from "@/actions/request.action";
import { toast } from "sonner";

export default function ConnectButton({ receiverId, isPending }: { receiverId: string, isPending: boolean }) {
  
  const [status, setStatus] = useState<string>((isPending ? "sent" : "idle"));

  const handleConnect = async () => {
    setStatus("loading");
    const res = await sendFriendRequest(receiverId);
    if (res.success) {
      setStatus("sent");
      toast.success("Request sent successfully!");
    } else {
      toast.error(res.message);
      if (res.message === "Request already sent!") {
        setStatus("sent");
      } else {
        setStatus("idle");
      }
    }
  };

  const handleCancelClick = async () => {
    if (status === "sent") {
      setStatus("confirming_cancel");
      
      // --- THE FIX IS HERE ---
      // We check the *current* status when the timer fires.
      // If the status is still "confirming_cancel", it means the user did nothing -> Reset it.
      // If the status is "idle" (because they clicked confirm), we do NOT touch it.
      setTimeout(() => {
        setStatus((currentStatus) => {
            return currentStatus === "confirming_cancel" ? "sent" : currentStatus;
        });
      }, 3000);

    } else if (status === "confirming_cancel") {
      setStatus("loading_cancel");
      const res = await cancelSentRequest(receiverId);
      if (res.success) {
        setStatus("idle"); 
      }
    }
  };

  // --- RENDER STATES ---

  if (status === "loading") {
    return (
        <button disabled className="bg-white text-black px-6 py-2 rounded-lg text-xs font-extrabold tracking-wide opacity-50">
            ...
        </button>
    );
  }

  if (status === "sent" || status === "confirming_cancel" || status === "loading_cancel") {
    return (
      <button 
        onClick={handleCancelClick}
        disabled={status === "loading_cancel"}
        className={`text-[10px] font-bold border px-6 py-2 rounded-lg uppercase tracking-wide transition-all cursor-pointer ${
            status === "confirming_cancel"
            ? "bg-red-500/20 border-red-500 text-red-400"
            : "bg-green-900/20 border-green-900 text-green-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400"
        }`}
      >
        {status === "confirming_cancel" ? "Confirm Undo?" : (status === "loading_cancel" ? "..." : "Request Sent ✓")}
      </button>
    );
  }

  // Default Idle State
  return (
    <button 
      onClick={handleConnect}
      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-6 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all active:scale-95 disabled:bg-gray-400 disabled:border-gray-400 min-w-[100px]"
    >
      CONNECT
    </button>
  );
}