"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      axios.post("/api/auth/verify-email", { token })
        .then(() => {
          setMessage("Email verified! Redirecting...");
          setTimeout(() => router.push("/auth/login"), 1500);
        })
        .catch(() => setMessage("Invalid or expired token."));
    } else {
      setMessage("Invalid verification link.");
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">{message}</p>
    </div>
  );
};

export default VerifyEmail;
