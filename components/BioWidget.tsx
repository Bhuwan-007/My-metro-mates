"use client";

import { useState } from "react";
import { updateBio } from "@/actions/user.actions";
import { toast } from "sonner";

export default function BioWidget({ initialBio }: { initialBio: string }) {
  const [bio, setBio] = useState(initialBio);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateBio(bio);
    toast.success("Bio Updated!");
    setIsEditing(false);
    setLoading(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-slate-900 border-dashed p-4 rounded-xl shadow-sm rotate-1 relative mt-4">
        <div className="absolute -top-3 left-4 bg-blue-100 px-2 border border-slate-300 text-[10px] font-mono uppercase -rotate-2">
            Editing Bio...
        </div>
        
        <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-24 bg-slate-50 border-2 border-slate-200 p-3 rounded-lg font-hand text-xl text-slate-900 outline-none focus:border-slate-900 resize-none"
            placeholder="Write something about yourself..."
            maxLength={150}
        />
        
        <div className="flex justify-end gap-2 mt-2">
            <button 
                onClick={() => setIsEditing(false)} 
                className="px-3 py-1 text-sm font-bold text-slate-400 hover:text-red-500 underline decoration-wavy"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-slate-900 text-white px-4 py-1 rounded-lg font-bold text-sm hover:bg-slate-700 transition-colors"
            >
                {loading ? "..." : "Save Note"}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group w-full mt-6">
        
        {/* THE PAPER NOTEBOOK CARD */}
        <div className="bg-[#fffdf5] p-6 shadow-sm border border-slate-200 relative overflow-hidden transition-transform hover:rotate-1">
            
            {/* Notebook Lines Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 24px' }}>
            </div>

            {/* Left Margin Line (Red) */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-red-300 opacity-50"></div>

            <div className="relative z-10 pl-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-hand text-2xl font-bold text-slate-900 highlight-yellow inline-block px-1 -rotate-1">
                        My Bio
                    </h3>
                    
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-8 h-8 rounded-full border-2 border-slate-900 bg-white hover:bg-yellow-500 flex items-center justify-center transition-colors shadow-[2px_2px_0px_#000] active:translate-y-px active:shadow-none cursor-pointer"
                    >
                        ✎
                    </button>
                </div>
                
                {/* THE BIO TEXT */}
                <p className="font-hand text-xl text-slate-800 leading-relaxed min-h-12 whitespace-pre-wrap">
                    {bio || <span className="text-slate-400 italic">No bio written yet... (Click pencil to add)</span>}
                </p>
            </div>

            {/* Paper Holes (Visual Detail) */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-evenly h-full py-4">
                <div className="w-3 h-3 bg-[#fdfbf7] rounded-full shadow-inner border border-slate-200"></div>
                <div className="w-3 h-3 bg-[#fdfbf7] rounded-full shadow-inner border border-slate-200"></div>
                <div className="w-3 h-3 bg-[#fdfbf7] rounded-full shadow-inner border border-slate-200"></div>
            </div>
        </div>
        
        {/* Tape Graphic */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 border-l border-r border-white/60 backdrop-blur-sm shadow-sm rotate-1"></div>
    </div>
  );
}