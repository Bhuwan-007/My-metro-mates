"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 w-10 h-10 rounded-full border-2 border-slate-900 bg-white dark:bg-slate-800 dark:border-white text-xl flex items-center justify-center transition-transform hover:scale-110 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff]"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}