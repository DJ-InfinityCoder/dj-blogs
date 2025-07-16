"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"; // ✅ Use Sonner
import { isDisposableEmail } from "@/lib/emailValidator";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isFake = await isDisposableEmail(email);
    if (isFake) {
      setError("Please insert a valid email address.");
      toast.error("Disposable email addresses are not allowed.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", { email, password });

      toast.success((response.data.message || "Verification email sent!"));
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error creating account";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg cursor-pointer
              bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 
              hover:from-purple-500 hover:to-indigo-400 dark:hover:from-purple-600 dark:hover:to-indigo-500 
              text-white font-semibold transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
