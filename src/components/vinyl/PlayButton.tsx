"use client";

import { useState } from "react";
import { Play, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  vinylId: string;
  onPlayed?: () => void;
  size?: "sm" | "default";
}

export function PlayButton({ vinylId, onPlayed, size = "default" }: PlayButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function handlePlay() {
    if (state !== "idle") return;
    setState("loading");

    try {
      const res = await fetch(`/api/vinyls/${vinylId}/play`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to log play");

      setState("done");
      toast.success("Logged as played today!");
      onPlayed?.();

      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
      toast.error("Could not log play. Try again.");
    }
  }

  return (
    <button
      onClick={handlePlay}
      disabled={state === "loading"}
      className={cn(
        "flex items-center gap-1.5 rounded-full font-medium transition-all",
        size === "sm"
          ? "px-3 py-1.5 text-xs"
          : "px-4 py-2 text-sm",
        state === "done"
          ? "bg-green-600 text-white"
          : "bg-amber-500 hover:bg-amber-400 text-black",
        state === "loading" && "opacity-70 cursor-not-allowed"
      )}
    >
      {state === "done" ? (
        <>
          <Check className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
          Played!
        </>
      ) : (
        <>
          <Play className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} fill="currentColor" />
          {size === "sm" ? "Played" : "Mark as played"}
        </>
      )}
    </button>
  );
}
