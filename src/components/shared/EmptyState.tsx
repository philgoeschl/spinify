import { Disc3 } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { href: string; label: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
        <Disc3 className="w-8 h-8 text-zinc-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-zinc-500 text-sm mt-1 max-w-xs">{description}</p>
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
