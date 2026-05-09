"use client";

import Link from "next/link";
import { Plus, Download, Upload } from "lucide-react";
import { useVinyls } from "@/hooks/useVinyls";
import { VinylCard } from "@/components/vinyl/VinylCard";
import { VinylCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CollectionPage() {
  const { vinyls, isLoading, mutate } = useVinyls();

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Collection</h1>
          {!isLoading && (
            <p className="text-zinc-500 text-sm mt-0.5">
              {vinyls.length} {vinyls.length === 1 ? "record" : "records"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/vinyls/export"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
          </a>
          <Link
            href="/import"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Import CSV"
          >
            <Upload className="w-5 h-5" />
          </Link>
          <Link
            href="/vinyl/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add vinyl
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <VinylCardSkeleton key={i} />)}
        </div>
      ) : vinyls.length === 0 ? (
        <EmptyState
          title="Your collection is empty"
          description="Add your first vinyl record to get started."
          action={{ href: "/vinyl/new", label: "Add first vinyl" }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {vinyls.map((vinyl) => (
            <VinylCard key={vinyl.id} vinyl={vinyl} onPlayed={mutate} />
          ))}
        </div>
      )}
    </div>
  );
}
