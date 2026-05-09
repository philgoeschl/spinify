import { VinylForm } from "@/components/vinyl/VinylForm";
import { VinylDisc } from "@/components/vinyl/VinylDisc";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewVinylPage() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-md mx-auto">
      <Link
        href="/collection"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to collection
      </Link>

      <div className="flex flex-col items-center gap-4 mb-8">
        <VinylDisc size="lg" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Add Vinyl</h1>
          <p className="text-zinc-500 text-sm mt-1">Add a record to your collection</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6">
        <VinylForm />
      </div>
    </div>
  );
}
