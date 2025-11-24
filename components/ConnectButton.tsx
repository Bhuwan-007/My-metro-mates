"use client";

import { useState } from "react";
import { sendFriendRequest } from "@/actions/request.action";

// Accept the "initialState" prop
export default function ConnectButton({ receiverId, isPending }: { receiverId: string, isPending: boolean }) {
  
  // If isPending is true, start as "sent". Otherwise start as "idle".
  const [status, setStatus] = useState<"idle" | "loading" | "sent">((isPending ? "sent" : "idle"));

  const handleConnect = async () => {
    setStatus("loading");
    
    const res = await sendFriendRequest(receiverId);
    
    if (res.success) {
      setStatus("sent");
    } else {
      alert(res.message);
      // If it failed because "Already Sent", we should still show "Sent" state
      if (res.message === "Request already sent!") {
        setStatus("sent");
      } else {
        setStatus("idle");
      }
    }
  };

  if (status === "sent") {
    return (
      // Restored the Green Style you liked ✅
      <button disabled className="text-[10px] font-bold text-green-400 bg-green-900/20 border border-green-900 px-6 py-2 rounded-lg uppercase tracking-wide cursor-default">
        Request Sent ✓
      </button>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      disabled={status === "loading"}
      className="bg-white hover:bg-blue-50 cursor-pointer text-black px-6 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
    >
      {status === "loading" ? "..." : "CONNECT"}
    </button>
  );
}