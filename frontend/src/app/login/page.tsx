"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("loggedIn", "true"); // mock login
      router.replace("/");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{
        backgroundColor: "--color-blue",
        backgroundImage: "url('/bg.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 40%",
      }}
      >

      <div className="text-center mb-6">
        <p className="font-header text-lg mb-1 text-[#192752]">
          Because habits are better with friends.
        </p>
        <h1 className="text-4xl font-header font-bold text-[#192752] mb-6">
          Login to Habit Buddy.
        </h1>
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center">
       <div className="absolute -top-6 left-[50%] -translate-x-[45%] z-20 select-none pointer-events-none">
        {focusedField === "password" ? (
          <Image
            src="/login/cover.gif"
            alt="Bunny covering eyes"
            width={200}
            height={200}
            className="w-[200px] h-auto"
            draggable={false}
          />
        ) : (
          <Image
            src="/login/normal.gif"
            alt="Bunny"
            width={200}
            height={200}
            className="w-[200px] h-auto"
            draggable={false}
          />
        )}
      </div>

        <div className="w-full rounded-2xl shadow-lg border border-neutral-300 bg-white mt-64 p-6 pt-6 z-10 relative">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-brand)] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-brand)] focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-[#192752] text-white rounded-lg py-2 font-semibold hover:bg-[#091330] transition"
            >
              Login
            </button>
          </form>
        </div>
          <p className="text-center text-sm text-[#192752] mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-[#192752] font-semibold hover:underline">
              Register
            </a>
          </p>
      </div>
    </main>
  );
}
