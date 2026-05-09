"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { VinylSchema, type VinylInput } from "@/schemas/vinyl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VinylForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VinylInput>({
    resolver: zodResolver(VinylSchema),
    defaultValues: { year: new Date().getFullYear() },
  });

  async function onSubmit(data: VinylInput) {
    try {
      const res = await fetch("/api/vinyls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Failed to add vinyl");
        return;
      }

      toast.success("Vinyl added to your collection!");
      router.push("/collection");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="artist" className="text-zinc-300">Artist</Label>
        <Input
          id="artist"
          {...register("artist")}
          placeholder="e.g. The Beatles"
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
        />
        {errors.artist && <p className="text-red-400 text-xs">{errors.artist.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="album" className="text-zinc-300">Album</Label>
        <Input
          id="album"
          {...register("album")}
          placeholder="e.g. Abbey Road"
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
        />
        {errors.album && <p className="text-red-400 text-xs">{errors.album.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="year" className="text-zinc-300">Year</Label>
        <Input
          id="year"
          type="number"
          {...register("year", { valueAsNumber: true })}
          placeholder="e.g. 1969"
          min={1900}
          max={new Date().getFullYear()}
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500"
        />
        {errors.year && <p className="text-red-400 text-xs">{errors.year.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold"
      >
        {isSubmitting ? "Adding…" : "Add to Collection"}
      </Button>
    </form>
  );
}
