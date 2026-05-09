import { cn } from "@/lib/utils";

interface VinylDiscProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  spinning?: boolean;
}

const sizes = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-48 h-48",
};

export function VinylDisc({ className, size = "md", spinning = false }: VinylDiscProps) {
  return (
    <div
      className={cn(
        "rounded-full relative shrink-0",
        sizes[size],
        spinning && "animate-spin",
        className
      )}
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #1a1a1a 12%, #2a2a2a 12%, #111 15%, #222 20%, #111 22%, #222 28%, #111 30%, #222 36%, #111 38%, #222 44%, #111 46%, #222 52%, #111 54%, #1a1a1a 60%)",
        animation: spinning ? "spin 2s linear infinite" : undefined,
      }}
    >
      {/* Label */}
      <div
        className="absolute inset-[30%] rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, #c45c1a 0%, #a0440e 60%, #7a3208 100%)",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
      </div>
      {/* Shine */}
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
