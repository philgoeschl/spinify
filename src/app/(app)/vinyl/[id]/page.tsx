"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { VinylDisc } from "@/components/vinyl/VinylDisc";
import { PlayButton } from "@/components/vinyl/PlayButton";
import { formatDate } from "@/lib/utils";
import type { VinylWithPlayLogs } from "@/types";

export default function VinylDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [vinyl, setVinyl] = useState<VinylWithPlayLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  async function fetchVinyl() {
    try {
      const res = await fetch(`/api/vinyls/${id}`);
      if (!res.ok) { router.push("/collection"); return; }
      setVinyl(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchVinyl(); }, [id]);

  async function handleDelete() {
    if (!confirm(`Delete "${vinyl?.album}" from your collection? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/vinyls/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Vinyl removed from collection");
      router.push("/collection");
    } catch {
      toast.error("Failed to delete vinyl");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="flex gap-6">
            <div className="w-40 h-40 rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-3">
              <div className="h-7 bg-zinc-800 rounded w-3/4" />
              <div className="h-5 bg-zinc-800 rounded w-1/2" />
              <div className="h-4 bg-zinc-800 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vinyl) return null;

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <Link
        href="/collection"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to collection
      </Link>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8">
        <VinylDisc size="lg" className="shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white leading-tight">{vinyl.album}</h1>
          <p className="text-xl text-zinc-400 mt-1">{vinyl.artist}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-sm">
            {vinyl.year}
          </span>
          <p className="text-zinc-600 text-sm mt-3">
            {vinyl.playLogs.length === 0
              ? "Never played"
              : `Played ${vinyl.playLogs.length} ${vinyl.playLogs.length === 1 ? "time" : "times"}`}
          </p>
          <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
            <PlayButton vinylId={vinyl.id} onPlayed={fetchVinyl} />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          Play history
        </h2>
        {vinyl.playLogs.length === 0 ? (
          <p className="text-zinc-600 text-sm">No plays recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {vinyl.playLogs.map((log) => (
              <li key={log.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-zinc-300 text-sm">{formatDate(log.playedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
