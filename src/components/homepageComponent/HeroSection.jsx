"use client";

import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function HeroSection({ blogsRef }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleReadMore = () => {
    router.push("/blogs/allcategories");
  };

  const handleClick = () => {
    if (status === "authenticated") {
      router.push("/dashboard/create-blog");
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center md:gap-12 max-w-6xl w-full dark:bg-transparent">
        <HeroHighlight containerClassName="text-center md:text-left dark:bg-transparent">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Write. Inspire. <Highlight>Impact.</Highlight>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
            A home for <b>storytellers, thinkers, and creators.</b> Share your
            journey, engage with an audience, and leave a mark on the world.
          </p>

          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
            <Button
              className="px-6 py-4 sm:py-5 border border-black text-base sm:text-lg cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 
             hover:from-purple-500 hover:to-indigo-400 dark:hover:from-purple-600 dark:hover:to-indigo-500 
             transition-all duration-300"
              onClick={handleClick}
            >
              Start Writing
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer border-1 border-black px-6 py-4 sm:py-5 text-base sm:text-lg dark:border-gray-400 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                if (blogsRef.current) {
                  const elementPosition =
                    blogsRef.current.getBoundingClientRect().top +
                    window.scrollY;
                  const gap = 40;
                  window.scrollTo({
                    top: elementPosition - gap,
                    behavior: "smooth",
                  });
                }
              }}
            >
              Explore Blogs
            </Button>
          </div>
        </HeroHighlight>

        <CardContainer containerClassName="flex justify-center md:justify-end w-full">
          <CardBody
            className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 
          w-full max-w-xs sm:max-w-md md:w-[400px] h-auto md:h-[450px] 
          bg-gradient-to-r from-indigo-300 to-purple-400 
          dark:from-indigo-700 dark:to-purple-800"
          >
            <CardItem
              as="div"
              translateZ={60}
              className="rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src="/blog.jpg"
                alt="Blog Showcase"
                width={500}
                height={300}
                className="object-cover rounded-xl w-full"
              />
            </CardItem>

            <CardItem
              as="h3"
              translateZ={40}
              className="mt-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200"
            >
              The Future of Storytelling
            </CardItem>

            <CardItem
              as="p"
              translateZ={30}
              className="mt-2 text-gray-600 dark:text-gray-200 text-sm sm:text-base"
            >
              Discover how AI, interactive media, and evolving platforms are
              shaping the next generation of blogging.
            </CardItem>

            <CardItem as="div" translateZ={20} className="mt-4">
              <Button
                variant="outline"
                onClick={handleReadMore}
                className="cursor-pointer px-6 py-2 border-indigo-600 dark:border-indigo-400 
                text-indigo-600 dark:text-indigo-300 
                hover:bg-indigo-100 dark:hover:bg-indigo-700/50 transition-all duration-300 text-sm sm:text-base"
              >
                Read More →
              </Button>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </div>
  );
}
