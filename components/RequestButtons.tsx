"use client";

import { acceptFriendRequest, rejectFriendRequest } from "@/actions/request.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RequestButtons({ senderId }: { senderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    await acceptFriendRequest(senderId);
    router.refresh(); // Refresh page to move them to "Connected" section
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectFriendRequest(senderId);
    router.refresh(); // Refresh page to remove the card
    setLoading(false);
  };

  if (loading) {
    return <span className="text-xs text-zinc-500 animate-pulse">Updating...</span>;
  }

  return (
    <div className="flex gap-2">
      {/* Reject Button */}
      <button 
        onClick={handleReject}
        className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-red-400 cursor-pointer hover:border-red-500/50 flex items-center justify-center transition-all"
      >
        ✕
      </button>

      {/* Accept Button */}
      <button 
        onClick={handleAccept}
        className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-500 cursor-pointer flex items-center justify-center shadow-lg shadow-blue-900/20 transition-all"
      >
        ✓
      </button>
    </div>
  );
}