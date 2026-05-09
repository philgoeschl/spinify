"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Disc3 } from "lucide-react";
import { LoginSchema, type LoginInput } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  async function onSubmit(data: LoginInput) {
    setAuthError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError("Invalid email or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <Disc3 className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">Spinify</h1>
          <p className="text-zinc-500 text-sm">Sign in to your collection</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {authError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {authError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          No account?{" "}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
