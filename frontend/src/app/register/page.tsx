"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "@/app/lib/api";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    if (!email.trim()) {
      toast.error("Email cannot be empty!");
      return;
    }
    if (!password.trim()) {
      toast.error("Password cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        email,
        display_name: displayName,
        password,
      });
      if (res.status === 201) {
        toast.success("Account created!");
        // you're already logged in (cookies set) -> go home
        setTimeout(() => router.push("/"), 1000);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-blue)] px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <h1 className="text-3xl font-header text-[#192752] mb-4 text-center">
          Create your account
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />

          <input
            type="email"
            placeholder="Email (will be your login)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#192752] hover:bg-[#091330] text-white py-2 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
