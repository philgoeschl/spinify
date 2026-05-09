"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2, Shield, ShieldOff, Users } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  vinylCount: number;
  playCount: number;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [status, session]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`Delete user "${user.email}"? This removes all their vinyls and play history.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success(`${user.email} deleted`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      toast.error("Failed to delete user");
    }
  }

  async function handleToggleRole(user: AdminUser) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success(`${user.email} is now ${newRole}`);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
    } catch {
      toast.error("Failed to update role");
    }
  }

  if (loading) {
    return (
      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-zinc-800 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-zinc-500 text-sm">{users.length} registered {users.length === 1 ? "user" : "users"}</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">User</th>
              <th className="text-left px-5 py-3 font-medium">Role</th>
              <th className="text-right px-5 py-3 font-medium">Vinyls</th>
              <th className="text-right px-5 py-3 font-medium">Plays</th>
              <th className="text-left px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === session?.user?.id;
              return (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">{user.name ?? "—"}</div>
                    <div className="text-zinc-500 text-xs">{user.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {user.role === "ADMIN" ? <Shield className="w-3 h-3" /> : null}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-zinc-300">{user.vinylCount}</td>
                  <td className="px-5 py-4 text-right text-zinc-300">{user.playCount}</td>
                  <td className="px-5 py-4 text-zinc-500 text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4">
                    {!isSelf && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleRole(user)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title={user.role === "ADMIN" ? "Remove admin" : "Make admin"}
                        >
                          {user.role === "ADMIN" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => {
          const isSelf = user.id === session?.user?.id;
          return (
            <div key={user.id} className="bg-zinc-900 rounded-2xl border border-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">{user.name ?? user.email}</div>
                  {user.name && <div className="text-zinc-500 text-xs truncate">{user.email}</div>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                    <span>{user.vinylCount} vinyls</span>
                    <span>{user.playCount} plays</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "ADMIN" ? "bg-amber-500/15 text-amber-400" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {user.role}
                  </span>
                  {!isSelf && (
                    <>
                      <button
                        onClick={() => handleToggleRole(user)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 transition-colors"
                      >
                        {user.role === "ADMIN" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
