"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/theme-context";
import { BlogProvider } from "@/context/BlogContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/webComponents/navbar";

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <ThemeProvider>
      <SessionProvider refetchInterval={5 * 60}>
        <BlogProvider>
          <>
            {mounted && <Navbar />}
            <main>{children}</main>
          </>
        </BlogProvider>
        <Toaster richColors />
      </SessionProvider>
    </ThemeProvider>
  );
}
