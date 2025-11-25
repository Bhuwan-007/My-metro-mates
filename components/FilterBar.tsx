"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timeFilter = searchParams.get("time") === "true";
  const genderFilter = searchParams.get("gender") || "all";
  const modeFilter = searchParams.get("mode") || "college"; // Default to college

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "false" || value === "college") {
        params.delete(key);
    } else {
        params.set(key, value);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
        
        {/* --- 1. THE BIG MODE SWITCHER --- */}
        <div className="grid grid-cols-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
                onClick={() => updateFilter("mode", "college")}
                className={`py-3 rounded-lg hover:cursor-pointer text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    modeFilter === "college" 
                    ? "bg-zinc-800 text-white shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
                <span>🎓 Same College</span>
                <span className="text-[10px] font-normal opacity-60">Direct Match</span>
            </button>

            <button
                onClick={() => updateFilter("mode", "route")}
                className={`py-3 rounded-lg hover:cursor-pointer text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    modeFilter === "route" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
                <span>🚇 Route Match</span>
                <span className="text-[10px] font-normal opacity-80">Inter-College</span>
            </button>
        </div>

        {/* --- 2. FINE TUNING (Gender/Time) --- */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Filters:</span>
            
            <button 
                onClick={() => updateFilter("time", timeFilter ? "false" : "true")}
                className={`px-4 hover:cursor-pointer py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-2 ${
                    timeFilter 
                    ? "bg-blue-500/10 border-blue-500 text-blue-400" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
            >
                <span>⏰</span> Match Time
            </button>

            <select 
                value={genderFilter}
                onChange={(e) => updateFilter("gender", e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold px-4 py-2 rounded-full outline-none focus:border-blue-500 appearance-none cursor-pointer hover:text-white"
            >
                <option value="all">All Genders</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
            </select>
        </div>
    </div>
  );
}