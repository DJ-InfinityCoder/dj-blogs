"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
      toast.error(result.error, { position: "top-center", autoClose: 5000 });
      setLoading(false);
    } else {
      toast.success("Login successful!", { position: "top-center", autoClose: 2000 });

      setTimeout(() => router.push("/dashboard/profile"), 2000);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    if (provider === "google") setGoogleLoading(true);
    if (provider === "github") setGithubLoading(true);

    await signIn(provider);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-4 py-3 sm:py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-3 sm:py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 sm:py-2 rounded-lg
              bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 
              hover:from-purple-500 hover:to-indigo-400 dark:hover:from-purple-600 dark:hover:to-indigo-500 
              text-white font-semibold transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>


        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={googleLoading}
            className={`w-full flex items-center justify-center py-3 sm:py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 ${googleLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Image
              src="/google.svg.png"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={githubLoading}
            className={`w-full flex items-center justify-center py-3 sm:py-2 border rounded-lg bg-gray-900 dark:bg-gray-700 text-white dark:text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 ${githubLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Image src="/github.svg" alt="GitHub" width={20}
              height={20} className="mr-2" />
            {githubLoading ? "Signing in with GitHub..." : "Sign in with GitHub"}
          </button>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          Don&#39;t have an account?{" "}
          <Link href="/auth/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
