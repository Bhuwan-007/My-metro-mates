export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7]">
      {/* Animated Pencil Emoji */}
      <div className="text-6xl animate-bounce mb-4">✏️</div>
      
      {/* Handwritten Text */}
      <h2 className="font-hand text-3xl font-bold text-slate-800 animate-pulse">
        Sketching layout...
      </h2>
      
      {/* Paper texture overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
    </div>
  );
}