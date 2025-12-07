"use client";

import { setDailyStatus, clearDailyStatus } from "@/actions/status.action";
import { useState } from "react";
import { toast } from "sonner"; // Added toast for feedback

export default function StatusWidget({ currentStatus, defaultTime }: { currentStatus: string, defaultTime: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [time, setTime] = useState(currentStatus || defaultTime);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await setDailyStatus(time);
    toast.success("Schedule Updated!");
    setIsEditing(false);
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    await clearDailyStatus();
    toast.info("Reset to Standard Time");
    setIsEditing(false);
    setLoading(false);
  };

  // --- EDIT MODE (The Popup) ---
  if (isEditing) {
    return (
      <div className="bg-white border-2 border-slate-900 border-dashed p-4 rounded-xl shadow-sm rotate-1 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-100 px-2 border border-slate-300 text-[10px] font-mono uppercase">
            Editing
        </div>
        
        <p className="text-xs text-slate-500 font-bold mb-2 font-hand">Set Today's Time:</p>
        
        <div className="flex gap-2">
            <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-slate-50 border-2 border-slate-200 text-slate-900 px-3 py-2 rounded-lg text-lg font-bold font-mono outline-none focus:border-slate-900 w-full"
            />
            <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors font-sans"
            >
                {loading ? "..." : "Save"}
            </button>
        </div>
        
        <button onClick={() => setIsEditing(false)} className="text-xs text-slate-400 mt-2 hover:text-red-500 underline decoration-wavy font-sans w-full text-center">
            Cancel
        </button>
      </div>
    );
  }

  // --- VIEW MODE (The Widget) ---
  return (
    <div className="relative group w-full">
        
        {/* The Card Container */}
        <div className={`p-4 rounded-xl border-2 transition-all ${currentStatus ? 'bg-green-50 border-slate-900' : 'bg-white border-slate-300 border-dashed'}`}>
            
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-slate-400 font-mono">
                        {currentStatus ? "Today's Schedule" : "Standard Schedule"}
                    </p>
                    <div className="flex items-center gap-2">
                        {/* THE TIME */}
                        <span className={`text-3xl font-black tracking-tight ${currentStatus ? "text-slate-900 font-outfit" : "text-slate-700 font-outfit"}`}>
                            {currentStatus || defaultTime}
                        </span>
                        
                        {/* LIVE BADGE */}
                        {currentStatus && (
                            <span className="text-[9px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded border border-green-700 animate-pulse shadow-sm">
                                LIVE
                            </span>
                        )}
                    </div>
                </div>
                
                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                    {currentStatus && (
                        <button 
                            onClick={handleReset} 
                            disabled={loading}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all" 
                            title="Reset to Default"
                        >
                            ✕
                        </button>
                    )}
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-700 flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-y-px active:shadow-none transition-all"
                    >
                        ✎
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}