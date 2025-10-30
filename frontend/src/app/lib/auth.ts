"use client";
import { api } from "./api";

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    window.location.href = "/login";
  }
}
