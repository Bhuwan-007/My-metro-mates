"use client";

import { useState } from "react";

export default function InfoTooltip() {
  const [show, setShow] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent clicks
    setShow(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => setShow(false), 5000);
  };

  return (
    <div className="relative inline-flex items-center ml-1 z-50">
      {/* The (i) Icon */}
      <button 
        onClick={handleClick}
        className="w-4 h-4 rounded-full border border-slate-400 text-slate-500 text-[9px] font-mono flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-transform bg-white"
        aria-label="Info"
      >
        i
      </button>

      {/* The Popup / Tooltip Message */}
      {show && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-48 bg-black/90 text-white text-[10px] p-2 rounded-lg shadow-xl text-center animate-in fade-in zoom-in duration-400 pointer-events-none">
          {/* Little arrow pointing down */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          
          <p className="font-bold mb-0.5 text-yellow-300">⚠️Instagram Limitation</p>
          <p>On mobile, Instagram may not open profiles directly. <br/>👉 Long-press the button and choose “Open in browser”</p>
        </div>
      )}
    </div>
  );
}