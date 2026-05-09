"use client";

import { Disc3 } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { VinylSlider } from "@/components/vinyl/VinylSlider";
import { VinylSliderSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

export default function HomePage() {
  const { lastPlayed, suggested, isLoading, mutate } = useDashboard();

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto space-y-10">
      <div className="flex items-center gap-3 md:hidden pt-2">
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
          <Disc3 className="w-5 h-5 text-black" />
        </div>
        <h1 className="text-xl font-bold text-white">Spinify</h1>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Suggested for today</h2>
        {isLoading ? (
          <VinylSliderSkeleton />
        ) : suggested.length === 0 ? (
          <EmptyState
            title="No suggestions yet"
            description="Add some vinyls to your collection to get daily suggestions."
            action={{ href: "/vinyl/new", label: "Add vinyl" }}
          />
        ) : (
          <VinylSlider vinyls={suggested} onPlayed={mutate} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Recently played</h2>
        {isLoading ? (
          <VinylSliderSkeleton />
        ) : lastPlayed.length === 0 ? (
          <div className="text-zinc-600 text-sm py-6">
            No plays logged yet. Hit &quot;Mark as played&quot; on any record!
          </div>
        ) : (
          <VinylSlider vinyls={lastPlayed} onPlayed={mutate} />
        )}
      </section>
    </div>
  );
}
