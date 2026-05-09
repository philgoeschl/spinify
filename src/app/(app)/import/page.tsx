"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import type { ImportResult } from "@/types";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/vinyls/import", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Import failed");
        return;
      }

      setResult(data as ImportResult);
      toast.success(`Import complete: ${data.added} added, ${data.updated} updated`);
    } catch {
      toast.error("Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-xl mx-auto">
      <Link
        href="/collection"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to collection
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2">Import Collection</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Upload a CSV file to import vinyls. Existing records are merged — no duplicates created.
      </p>

      <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-zinc-300 mb-2">CSV Format</h2>
          <div className="bg-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-400">
            artist,album,year,play_dates<br />
            &quot;The Beatles&quot;,&quot;Abbey Road&quot;,1969,&quot;2024-01-15|2024-03-20&quot;<br />
            &quot;Pink Floyd&quot;,&quot;The Wall&quot;,1979,&quot;&quot;
          </div>
          <p className="text-zinc-600 text-xs mt-2">
            play_dates: pipe-separated dates (YYYY-MM-DD). Leave empty if never played.
          </p>
        </div>

        <div>
          <label
            htmlFor="csv-file"
            className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            {file ? (
              <>
                <FileText className="w-8 h-8 text-amber-400" />
                <span className="text-white text-sm font-medium">{file.name}</span>
                <span className="text-zinc-500 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-zinc-600" />
                <span className="text-zinc-400 text-sm">Click to select CSV file</span>
              </>
            )}
          </label>
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); }}
          />
        </div>

        {result && (
          <div className="bg-zinc-800 rounded-xl p-4 space-y-1.5">
            <h3 className="text-sm font-medium text-white mb-2">Import Summary</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-green-400">✓ {result.added} added</span>
              <span className="text-blue-400">↻ {result.updated} updated</span>
              <span className="text-zinc-500">— {result.skipped} skipped</span>
            </div>
            {result.errors.length > 0 && (
              <ul className="mt-2 space-y-1">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-red-400 text-xs">{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Importing…" : "Import"}
          </button>
          <a
            href="/api/vinyls/export"
            className="flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Export first
          </a>
        </div>
      </div>
    </div>
  );
}
