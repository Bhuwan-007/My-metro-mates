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
    <div className="flex flex-col gap-4">
        
        {/* 1. PRIMARY MODE SWITCHER (Torn Paper Tabs) */}
        <div className="flex gap-2">
            <button
                onClick={() => updateFilter("mode", "college")}
                className={`flex-1 py-3 font-hand text-xl font-bold border-2 border-slate-900 transition-all ${
                    modeFilter === "college" 
                    ? "bg-[#ee781e] -translate-y-1 shadow-[4px_4px_0px_#000]" 
                    : "bg-white text-slate-400 hover:bg-slate-50 cursor-pointer"
                }`}
            >
                🎓 Same College
            </button>

            <button
                onClick={() => updateFilter("mode", "route")}
                className={`flex-1 py-3 font-hand text-xl font-bold border-2 border-slate-900 transition-all ${
                    modeFilter === "route" 
                    ? "bg-[#b3e5fc] -translate-y-1 shadow-[4px_4px_0px_#000]" 
                    : "bg-white text-slate-400 hover:bg-slate-50 cursor-pointer"
                }`}
            >
                🚇 Route Match
            </button>
        </div>

        {/* 2. FILTERS ROW */}
        <div className="flex items-center justify-between gap-2 bg-white border-2 border-slate-900 p-2 shadow-sm rotate-1">
            
            {/* Scrollable Filters Area */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar flex-1">
                <span className="font-hand text-lg font-bold text-slate-900">Filters:</span>
                
                {/* Time Filter (Checkbox Style) */}
                <button 
                    onClick={() => updateFilter("time", timeFilter ? "false" : "true")}
                    className={`cursor-pointer px-3 py-1 font-hand text-lg font-bold border-2 border-slate-900 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        timeFilter 
                        ? "bg-slate-900 text-white" 
                        : "bg-transparent text-slate-500 hover:bg-slate-100 "
                    }`}
                >
                    <span>{timeFilter ? "☑" : "☐"}</span> Match Time
                </button>

                {/* Gender Select (Paper Dropdown) */}
                <div className="relative border-2 border-black bg-white">
                    <select 
                        value={genderFilter}
                        onChange={(e) => updateFilter("gender", e.target.value)}
                        className="font-hand text-lg text-black font-bold px-4 py-1 bg-transparent outline-none appearance-none cursor-pointer w-full pr-8"
                    >
                        <option value="all">All Genders</option>
                        <option value="male">Male Only</option>
                        <option value="female">Female Only</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs">▼</span>
                </div>
            </div>

            {/* Refresh Button (Pinned Right) */}
            <div className="pl-2 border-l-2 border-slate-200 shrink-0 cursor-pointer">
                <RefreshButton />
            </div>

        </div>
    </div>
  );
}