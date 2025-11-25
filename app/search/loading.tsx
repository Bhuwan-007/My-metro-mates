export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white pb-32 pt-32 px-6">
      
      {/* Header Skeleton */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div className="space-y-2">
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-zinc-800 rounded-full animate-pulse"></div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[240px] bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                
                {/* Top Row */}
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Middle Lines */}
                <div className="space-y-3 pl-2">
                    <div className="h-3 w-40 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse"></div>
                </div>

                {/* Bottom Row */}
                <div className="flex gap-2 pt-4">
                    <div className="h-8 flex-1 bg-zinc-800 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-16 bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>

            </div>
        ))}
      </div>
    </div>
  );
}