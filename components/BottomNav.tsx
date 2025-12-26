"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const isAdmin = ["chugh.bhuwan@gmail.com"].includes(userEmail);
  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm">
      {/* USE THE NEW CLASS HERE: nav-card */}
      <div className="nav-card flex justify-between items-center px-4 py-2 rotate-1 rounded-full">
        
        <NavItem href="/dashboard" active={isActive('/dashboard')} label="Home" emoji="🏠" />
        <NavItem href="/search" active={isActive('/search')} label="Find" emoji="🔍" />
        <NavItem href="/mates" active={isActive('/mates')} label="Mates" emoji="🤝" />
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
                <span className={`text-[10px] font-hand font-bold ${danger ? 'text-red-600' : 'text-inherit'}`}>
                    {label}
                </span>
            )}
        </Link>
    )
}