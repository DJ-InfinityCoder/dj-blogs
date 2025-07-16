"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Menu,
  X,
  CircleUserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/blogsCategory");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (
      !event.target.closest(".dropdown-menu") &&
      !event.target.closest(".blog-dropdown") &&
      !event.target.closest(".profile-dropdown")
    ) {
      setDropdownOpen(false);
      setBlogDropdownOpen(false);
      setProfileDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <nav className="w-full fixed top-0 bg-white dark:bg-black border-b px-6 py-4 flex justify-between items-center z-50">
      <h1
        className="cursor-pointer text-2xl font-bold text-gray-900 dark:text-white"
        onClick={() => router.push("/")}
      >
        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent">
          DJ Blogs
        </span>
      </h1>

      <div className="hidden md:flex space-x-4 items-center">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => router.push("/")}
        >
          Home
        </Button>

        <div className="relative dropdown-menu ">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setBlogDropdownOpen((prev) => !prev)}
          >
            Blogs <ChevronDown size={16} />
          </Button>

          <AnimatePresence>
            {blogDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700"
              >
                <button
                  className="cursor-pointer w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    router.push(`/blogs/allcategories`);
                    setBlogDropdownOpen(false);
                  }}
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category.name}
                    className=" cursor-pointer w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      router.push(`/blogs?category=${category.name}`);
                      setBlogDropdownOpen(false);
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {session ? (
          <div className="relative profile-dropdown">
            <Button
              variant="ghost"
              className="cursor-pointer flex items-center space-x-2"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
            >
              <CircleUserRound size={28} className="scale-150" />
              <ChevronDown size={16} />
            </Button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700"
                >
                  <button
                    className="w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      router.push("/dashboard/profile");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      router.push("/dashboard/profile");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Button
            className="cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 
      hover:from-purple-500 hover:to-indigo-400 dark:hover:from-purple-600 dark:hover:to-indigo-500 
      transition-all duration-300"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
        )}

        <div className="relative dropdown-menu">
          <Button
            variant="ghost"
            className=" cursor-pointer flex items-center space-x-2"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Theme Selector"
          >
            {theme === "light" ? (
              <Sun className="scale-120" size={20} />
            ) : theme === "dark" ? (
              <Moon className="scale-120" size={20} />
            ) : (
              <Monitor className="scale-120" size={20} />
            )}
            <ChevronDown size={16} />
          </Button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700"
              >
                {["light", "dark", "system"].map((mode) => (
                  <button
                    key={mode}
                    className=" cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setTheme(mode);
                      setDropdownOpen(false);
                    }}
                  >
                    {mode === "light" ? (
                      <Sun size={16} />
                    ) : mode === "dark" ? (
                      <Moon size={16} />
                    ) : (
                      <Monitor size={16} />
                    )}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="md:hidden flex justify-center items-center gap-2">
        <div className="md:hidden relative dropdown-menu">
          <Button
            variant="ghost"
            className=" cursor-pointer flex items-center space-x-2"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Theme Selector"
          >
            {theme === "light" ? (
              <Sun className="scale-120" size={20} />
            ) : theme === "dark" ? (
              <Moon className="scale-120" size={20} />
            ) : (
              <Monitor className="scale-120" size={20} />
            )}
            <ChevronDown size={16} />
          </Button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700"
              >
                {["light", "dark", "system"].map((mode) => (
                  <button
                    key={mode}
                    className=" cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setTheme(mode);
                      setDropdownOpen(false);
                    }}
                  >
                    {mode === "light" ? (
                      <Sun size={16} />
                    ) : mode === "dark" ? (
                      <Moon size={16} />
                    ) : (
                      <Monitor size={16} />
                    )}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          className="cursor-pointer md:hidden p-1 text-gray-900 dark:text-white hover:bg-[#F5F5F5] rounded"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-black shadow-lg flex flex-col px-6 py-8 z-50"
            >
              <button
                className=" cursor-pointer self-end p-2 hover:bg-neutral-200 dark:hover:bg-neutral-400 dark:hover:text-black rounded-full text-gray-900 dark:text-white"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X size={28} />
              </button>

              <Button
                variant="ghost"
                className="w-full text-left justify-start mt-4 pl-3 cursor-pointer"
                onClick={() => {
                  router.push("/");
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </Button>

              <div className="w-full mt-2 mb-4">
                <Button
                  variant="ghost"
                  className="cursor-pointer blog-dropdown flex justify-between items-center w-full px-4 py-3 text-left text-gray-900 dark:text-white"
                  onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
                >
                  Blogs{" "}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      blogDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                <AnimatePresence>
                  {blogDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-white dark:bg-gray-900 rounded-md mt-2 border dark:border-gray-700"
                    >
                      <button
                        className="cursor-pointer w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          router.push(`/blogs/all`);
                          setMobileMenuOpen(false);
                        }}
                      >
                        All Blogs
                      </button>

                      <div className="border-t dark:border-gray-700"></div>

                      {categories.map((category) => (
                        <button
                          key={category.name}
                          className="cursor-pointer w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            router.push(`/blogs?category=${category.name}`);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {category.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <hr className="mt-2 mb-2" />

              {session ? (
                <div className="w-full mt-4">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-3 mb-2">
                    Account
                  </p>

                  <Button
                    variant="ghost"
                    className="w-full text-left justify-start px-3 py-2 cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      router.push("/dashboard/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-left justify-start px-3 py-2 cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      router.push("/dashboard/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-left justify-start px-3 py-2 cursor-pointer text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  className=" mt-4 cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-500 dark:to-purple-600 
            hover:from-purple-500 hover:to-indigo-400 dark:hover:from-purple-600 dark:hover:to-indigo-500 
            transition-all duration-300"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
