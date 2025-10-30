"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await api.post("/auth/logout");
    } catch (e) {

    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={
        className ||
        "px-3 py-1.5 rounded-lg bg-[#192752] text-white text-sm font-medium hover:bg-[#091330] transition disabled:opacity-60"
      }
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
