"use client";

import { useState } from "react";
import { updateBio } from "@/actions/user.actions";
import { toast } from "sonner";

export default function BioWidget({ initialBio }: { initialBio: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateBio(bio);
    
    if (res.success) {
        toast.success("Bio updated!");
        setIsEditing(false);
    } else {
        toast.error("Failed to update.");
    }
    setLoading(false);
  };

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <div className="mt-8 pt-6 border-t border-white/5 animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Update Bio</p>
        <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full bg-black border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-blue-500 resize-none mb-2"
            placeholder="Tell us about your route..."
        />
        <div className="flex gap-2">
            <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
                {loading ? "..." : "Save"}
            </button>
            <button 
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white text-xs px-2"
            >
                Cancel
            </button>
        </div>
      </div>
    );
  }

  // --- VIEW MODE ---
  return (
    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-start group">
        <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">My Bio</p>
            <p className="text-sm text-gray-300 italic line-clamp-2">
                "{bio || "No bio set yet."}"
            </p>
        </div>
        <button 
            onClick={() => setIsEditing(true)}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-xs text-gray-400 transition-colors cursor-pointer"
            title="Edit Bio"
        >
            ✎
        </button>
    </div>
  );
}