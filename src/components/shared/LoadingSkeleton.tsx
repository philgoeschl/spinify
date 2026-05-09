import { Skeleton } from "@/components/ui/skeleton";

export function VinylCardSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-white/5 p-4 flex flex-col gap-3">
      <Skeleton className="w-full aspect-square rounded-full bg-zinc-800" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 bg-zinc-800" />
        <Skeleton className="h-3 w-1/2 bg-zinc-800" />
        <Skeleton className="h-3 w-1/4 bg-zinc-800" />
      </div>
    </div>
  );
}

export function VinylSliderSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="shrink-0 w-40">
          <VinylCardSkeleton />
        </div>
      ))}
    </div>
  );
}
