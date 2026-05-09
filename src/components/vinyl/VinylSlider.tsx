"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VinylCard } from "./VinylCard";
import type { VinylWithLastPlay } from "@/types";

interface VinylSliderProps {
  vinyls: VinylWithLastPlay[];
  onPlayed?: () => void;
}

export function VinylSlider({ vinyls, onPlayed }: VinylSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <div className="relative group/slider">
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-zinc-800 border border-white/10 rounded-full items-center justify-center text-zinc-400 hover:text-white opacity-0 group-hover/slider:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {vinyls.map((vinyl) => (
          <div
            key={vinyl.id}
            className="shrink-0 w-40"
            style={{ scrollSnapAlign: "start" }}
          >
            <VinylCard vinyl={vinyl} onPlayed={onPlayed} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-zinc-800 border border-white/10 rounded-full items-center justify-center text-zinc-400 hover:text-white opacity-0 group-hover/slider:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
