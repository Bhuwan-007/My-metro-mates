export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="relative z-10 w-full max-w-md px-10">
        
        {/* 1. THE TEXT (Generic Version) */}
        <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white tracking-widest uppercase animate-pulse">
                My Metro Mates
            </h3>
            <p className="text-zinc-500 text-xs font-mono mt-2">Arriving at platform...</p>
        </div>

        {/* 2. THE TRACK LINE */}
        <div className="relative w-full h-[2px] bg-zinc-800 rounded-full overflow-visible">
            
            {/* 3. THE MOVING TRAIN */}
            <div className="absolute top-[-14px] left-0 w-12 h-8 text-blue-500 animate-metro filter drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform -scale-x-100">
                    <path d="M18 6L6 6C3.79 6 2 7.79 2 10V16C2 17.5 3.09 18.73 4.51 19.05C4.18 19.3 4 19.71 4 20.17V21.5C4 21.78 4.22 22 4.5 22H5.5C5.78 22 6 21.78 6 21.5V20H18V21.5C18 21.78 18.22 22 18.5 22H19.5C19.78 22 20 21.78 20 21.5V20.17C20 19.71 19.82 19.3 19.49 19.05C20.91 18.73 22 17.5 22 16V10C22 7.79 20.21 6 18 6ZM15.5 16H8.5V14H15.5V16ZM18 11H6V9H18V11Z" />
                </svg>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-4 bg-gradient-to-r from-blue-400/50 to-transparent blur-sm"></div>
            </div>

            {/* 4. STATION DOTS */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-2 h-2 bg-zinc-700 rounded-full"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-2 h-2 bg-zinc-700 rounded-full"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[80%] w-2 h-2 bg-zinc-700 rounded-full"></div>
        </div>
      </div>

      <style>{`
        @keyframes metro-travel {
          0% { left: -20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        .animate-metro {
          animation: metro-travel 1.5s linear infinite;
        }
      `}</style>

    </div>
  );
}