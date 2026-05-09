"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/collection", label: "Collection", icon: LayoutGrid },
  { href: "/vinyl/new", label: "Add", icon: PlusCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-t border-white/10 flex">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href === "/dashboard" && pathname === "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
              active ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
