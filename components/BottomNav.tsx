"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const isAdmin = ["your.email@gmail.com"].includes(userEmail); // Add your email
  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm">
      {/* Torn Paper Nav */}
      <div className="flex justify-between items-center bg-white border-2 border-slate-900 px-4 py-2 shadow-[4px_4px_0px_#000] rotate-1">
        
        <NavItem href="/dashboard" active={isActive('/dashboard')} label="Home" emoji="🏠" />
        <NavItem href="/search" active={isActive('/search')} label="Find" emoji="🔍" />
        <NavItem href="/mates" active={isActive('/mates')} label="Mates" emoji="👯‍♂️" />
        <NavItem href="/onboarding" active={isActive('/onboarding')} label="You" emoji="👤" />
        {isAdmin && <NavItem href="/admin" active={isActive('/admin')} label="Admin" emoji="🛡️" danger />}

      </div>
    </div>
  );
}

function NavItem({ href, active, label, emoji, danger }: any) {
    return (
        <Link href={href} className={`flex flex-col items-center justify-center w-12 h-12 transition-transform ${active ? 'scale-110 -translate-y-1' : 'opacity-50 hover:opacity-100'}`}>
            <span className="text-2xl filter drop-shadow-sm">{emoji}</span>
            {active && (
                <span className={`text-[10px] font-hand font-bold ${danger ? 'text-red-600' : 'text-slate-900'}`}>
                    {label}
                </span>
            )}
        </Link>
    )
}