export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
      
      {/* 1. The Scribble SVG */}
      <div className="relative w-24 h-24 mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full rotate-90 transform">
            {/* The Scribble Path */}
            <path
                d="M50 50c-30 0-40 20-30 40 10 15 40 10 50-10 10-25-20-40-50-30-20 5-20 30-5 40 20 10 50-10 40-40-5-15-40-10-50 10-5 10 10 20 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-900 dark:text-white animate-scribble"
            />
        </svg>
        
        {/* Pencil centered */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
            ✏️
        </div>
      </div>

      {/* 2. Handwritten Text */}
      <h2 className="font-kalam text-2xl font-bold text-slate-900 dark:text-white animate-pulse">
        Sketching layout...
      </h2>
      
    </div>
  );
}