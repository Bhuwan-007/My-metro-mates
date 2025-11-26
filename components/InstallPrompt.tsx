"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already installed
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // 2. Check if iOS
    // (iOS doesn't support the install prompt event, so we show instructions)
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // 3. Capture the Android/Desktop install event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Stop browser from hiding it
      setDeferredPrompt(e); // Save it for later
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Trigger the install prompt
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // Don't show anything if already installed as an app
  if (isStandalone) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-12 px-4">
      
      {/* ANDROID / DESKTOP BUTTON */}
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="w-full bg-zinc-900 border border-zinc-800 text-white py-4 rounded-2xl flex items-center justify-between px-6 shadow-xl hover:bg-zinc-800 transition-all group"
        >
          <div className="text-left">
            <p className="text-sm font-bold text-blue-400 uppercase tracking-wider">Get the App</p>
            <p className="text-xs text-zinc-500">Install for a better experience</p>
          </div>
          <div className="bg-blue-600 p-2 rounded-full group-hover:scale-110 cursor-pointer transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </div>
        </button>
      )}

      {/* iOS INSTRUCTIONS (Only visible on iPhones) */}
      {isIOS && (
        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex gap-4 items-center">
           <div className="bg-zinc-800 p-3 rounded-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
           </div>
           <div>
             <p className="text-sm font-bold text-white">Install on iPhone</p>
             <p className="text-xs text-zinc-400 mt-1">
               Tap <span className="inline-block mx-1"><svg className="w-3 h-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg></span> 
               Share, then "Add to Home Screen"
             </p>
           </div>
        </div>
      )}

    </div>
  );
}