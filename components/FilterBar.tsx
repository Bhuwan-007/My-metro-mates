"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timeFilter = searchParams.get("time") === "true";
  const genderFilter = searchParams.get("gender") || "all";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "false") {
        params.delete(key);
    } else {
        params.set(key, value);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        
        {/* Time Toggle */}
        <button 
            onClick={() => updateFilter("time", timeFilter ? "false" : "true")}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                timeFilter 
                ? "bg-blue-600 border-blue-500 text-white" 
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
        >
            ⏰ Match My Time
        </button>

        {/* Gender Toggle */}
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
  );
}