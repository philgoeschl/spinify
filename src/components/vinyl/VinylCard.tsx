import Link from "next/link";
import { VinylDisc } from "./VinylDisc";
import { PlayButton } from "./PlayButton";
import { daysAgoLabel } from "@/lib/utils";
import type { VinylWithLastPlay } from "@/types";

interface VinylCardProps {
  vinyl: VinylWithLastPlay;
  onPlayed?: () => void;
}

export function VinylCard({ vinyl, onPlayed }: VinylCardProps) {
  return (
    <div className="group relative bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-amber-500/30 hover:bg-zinc-800/80 transition-all duration-200">
      <Link href={`/vinyl/${vinyl.id}`} className="flex flex-col items-center p-4 gap-3 flex-1">
        <VinylDisc size="md" className="transition-transform duration-300 group-hover:scale-105" />
        <div className="w-full text-center">
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{vinyl.album}</p>
          <p className="text-zinc-400 text-xs mt-0.5 line-clamp-1">{vinyl.artist}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-xs">
            {vinyl.year}
          </span>
        </div>
        <p className="text-xs text-zinc-600">{daysAgoLabel(vinyl.lastPlayedAt)}</p>
      </Link>
      <div className="px-4 pb-4 flex justify-center">
        <PlayButton vinylId={vinyl.id} onPlayed={onPlayed} size="sm" />
      </div>
    </div>
  );
}
