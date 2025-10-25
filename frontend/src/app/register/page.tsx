"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    console.log("Mock register:", { name, email, password });
    
    toast.success("Account created successfully!");
    
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#28a5ff] px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <h1 className="text-3xl font-header text-[#192752] mb-4 text-center">
          Create your account
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* Input field */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />

          <input
            type="email"
            placeholder="Email"
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
            className="bg-[#192752] hover:bg-[#091330] text-white py-2 rounded-lg font-semibold transition"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
