"use client";

import HeroSection from "@/components/homepageComponent/HeroSection";
import TrendingBlogs from "@/components/homepageComponent/TrendingBlogs";
import { useRef } from "react";

export default function Home() {
  const blogsRef = useRef(null);

  return (
    <>
      <HeroSection blogsRef={blogsRef} />
      <TrendingBlogs blogsRef={blogsRef} />
    </>
  );
}
