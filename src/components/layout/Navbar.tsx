"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Disc3, LogOut, User, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/collection", label: "Collection" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-zinc-950/90 backdrop-blur-sm items-center px-6 gap-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-white font-bold text-lg shrink-0">
        <Disc3 className="w-6 h-6 text-amber-400" />
        Spinify
      </Link>

      <nav className="flex items-center gap-1 flex-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href="/vinyl/new"
          className="px-2.5 h-7 inline-flex items-center text-[0.8rem] font-medium text-zinc-400 hover:text-white hover:bg-muted rounded-[min(var(--radius-md),12px)] transition-colors"
        >
          + Add Vinyl
        </Link>
        <a
          href="/api/vinyls/export"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Export collection"
        >
          <Download className="w-4 h-4" />
        </a>
        <Link
          href="/import"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Import CSV"
        >
          <Upload className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <User className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-400">{session?.user?.name ?? session?.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
