import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col items-center justify-center p-6">
      
      {/* Background FX */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center text-zinc-500 hover:text-white text-sm font-bold mb-8 transition-colors">
            ← Back to App
        </Link>

        {/* --- DEVELOPER CARD --- */}
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
            
            {/* Glow Effect (FIXED: Added pointer-events-none) */}
            <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            {/* Avatar */}
            <div className="relative mx-auto w-24 h-24 mb-6 z-10">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-50 animate-pulse"></div>
                <img 
                    src="https://github.com/bhuwan-007.png" 
                    alt="Developer" 
                    className="relative w-full h-full rounded-full border-4 border-black object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-black w-6 h-6 rounded-full"></div>
            </div>

            {/* Content (Wrapped in relative z-10 to sit above the glow) */}
            <div className="relative z-10">
                <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                    Bhuwan Chugh
                </h1>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                    Full Stack Developer
                </p>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    Built <strong>My Metro Mates</strong>. Saw students posting that they need someone to commute with so came up with this. 
                    Powered by Next.js 15, MongoDB, Clerk and Caffeine ☕.
                </p>

                {/* --- SOCIAL LINKS --- */}
                <div className="flex flex-col gap-3">
                    
                    {/* GitHub */}
                    <a 
                        href="https://github.com/bhuwan-007" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-zinc-900 hover:bg-white hover:text-black text-white border border-zinc-800 py-3 rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        <span>GitHub</span>
                    </a>

                    {/* LinkedIn */}
                    <a 
                        href="https://linkedin.com/in/bhuwan-chugh" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-[#0077B5] hover:bg-[#006396] text-white border border-transparent py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        <span>LinkedIn</span>
                    </a>

                </div>

                {/* Tech Stack */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-2">
                    {["Next.js 15", "TypeScript", "MongoDB", "Tailwind", "PWA"].map((tech) => (
                        <span key={tech} className="text-[10px] bg-white/5 text-zinc-500 px-2 py-1 rounded border border-white/5">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

        </div>

        {/* Version */}
        <p className="text-center text-zinc-600 text-xs mt-8 font-mono">
            v1.0.0 • Made in India 🇮🇳
        </p>

      </div>
    </div>
  );
}