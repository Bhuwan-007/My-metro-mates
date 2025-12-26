"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RefreshButton from "@/components/RefreshButton"; 

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timeFilter = searchParams.get("time") === "true";
  const genderFilter = searchParams.get("gender") || "all";
  const modeFilter = searchParams.get("mode") || "college"; 

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
    <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
        
        {/* 1. COMPACT MODE SWITCHER */}
        <div className="flex gap-2">
            <button
                onClick={() => updateFilter("mode", "college")}
                className={`flex-1 py-2 font-hand text-base font-bold border-2 border-slate-900 dark:border-slate-400 transition-all rounded-sm ${
                    modeFilter === "college" 
                    ? "bg-[#ee781e] text-white -translate-y-0.5 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff]" 
                    : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                }`}
            >
                🎓 Same College
            </button>

            <button
                onClick={() => updateFilter("mode", "route")}
                className={`flex-1 py-2 font-hand text-base font-bold border-2 border-slate-900 dark:border-slate-400 transition-all rounded-sm ${
                    modeFilter === "route" 
                    ? "bg-[#b3e5fc] text-slate-900 -translate-y-0.5 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff]" 
                    : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                }`}
            >
                🚇 Route Match
            </button>
        </div>

        {/* 2. SLIM FILTERS ROW */}
        <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-400 px-3 py-1.5 shadow-sm rotate-1 rounded-sm">
            
            {/* Scrollable Filters Area */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1">
                <span className="font-hand text-sm font-bold text-slate-900 dark:text-white shrink-0">Filters:</span>
                
                {/* Time Filter (Compact) */}
                <button 
                    onClick={() => updateFilter("time", timeFilter ? "false" : "true")}
                    className={`cursor-pointer px-2 py-0.5 font-hand text-sm font-bold border-2 border-slate-900 dark:border-slate-400 rounded-sm flex items-center gap-1 whitespace-nowrap transition-colors ${
                        timeFilter 
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                        : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                >
                    <span className="text-xs">{timeFilter ? "☑" : "☐"}</span> Match Time
                </button>

                {/* Gender Select (Compact) */}
                <div className="relative border-b-2 border-slate-900 dark:border-slate-400">
                    <select 
                        value={genderFilter}
                        onChange={(e) => updateFilter("gender", e.target.value)}
                        className="font-hand text-sm font-bold bg-transparent outline-none appearance-none cursor-pointer pr-6 py-0.5 text-slate-900 dark:text-white"
                    >
                        <option value="all" className="dark:bg-slate-800">All Genders</option>
                        <option value="male" className="dark:bg-slate-800">Male Only</option>
                        <option value="female" className="dark:bg-slate-800">Female Only</option>
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-500">▼</span>
                </div>
            </div>

            {/* Refresh Button (Pinned Right) */}
            <div className="pl-2 border-l-2 border-slate-200 dark:border-slate-600 shrink-0 cursor-pointer">
                <RefreshButton />
            </div>

        </div>
    </div>
  );
}