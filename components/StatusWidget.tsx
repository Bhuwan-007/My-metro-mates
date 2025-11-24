"use client";

import { setDailyStatus, clearDailyStatus } from "@/actions/status.action";
import { useState } from "react";

export default function StatusWidget({ currentStatus, defaultTime }: { currentStatus: string, defaultTime: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [time, setTime] = useState(currentStatus || defaultTime);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await setDailyStatus(time);
    setIsEditing(false);
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    await clearDailyStatus();
    setIsEditing(false);
    setLoading(false);
  };

  if (isEditing) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-xl">
        <p className="text-xs text-zinc-400 uppercase font-bold mb-2">Set Time for Today</p>
        <div className="flex gap-2">
            <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-black border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 outline-none w-full"
            />
            <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
                {loading ? "..." : "Set"}
            </button>
        </div>
        <button onClick={() => setIsEditing(false)} className="text-xs text-zinc-500 mt-2 hover:text-zinc-300 underline">Cancel</button>
      </div>
    );
  }

  return (
    <div className="relative group">
        {/* The Status Pill */}
        <div className={`p-4 rounded-2xl border transition-all ${currentStatus ? 'bg-blue-900/20 border-blue-500/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider mb-1 text-zinc-500">
                        {currentStatus ? "Today's Schedule" : "Standard Schedule"}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-mono font-bold ${currentStatus ? "text-blue-400" : "text-white"}`}>
                            {currentStatus || defaultTime}
                        </span>
                        {currentStatus && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded animate-pulse">LIVE</span>}
                    </div>
                </div>
                
                {/* Edit Button */}
                <div className="flex gap-2">
                    {currentStatus && (
                        <button onClick={handleReset} className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-900/30 hover:text-red-400 flex items-center justify-center transition-colors" title="Reset to Default">
                            ✕
                        </button>
                    )}
                    <button onClick={() => setIsEditing(true)} className="w-8 h-8 rounded-full bg-white text-black hover:bg-blue-200 flex items-center justify-center shadow-lg transition-colors">
                        ✎
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}