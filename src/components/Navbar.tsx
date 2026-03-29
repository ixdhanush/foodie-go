"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useTheme } from "next-themes";
import { ShoppingCart, Menu, X, Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const isAdmin = session?.user && (session.user as any).role === "admin";

  return (
    <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex shrink-0 items-center">
              <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                FoodieGo
              </span>
            </Link>
            
            <div className="hidden md:flex md:space-x-8">
              <Link href="/foods" className="text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 font-medium">
                Menu
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-gray-900 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 font-medium">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link href="/cart" className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <ShoppingCart size={24} />
              {cartCount > 0 && mounted && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium dark:text-gray-300">
                  Hi, {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <Link href="/cart" className="relative p-2 mr-4 text-gray-500 dark:text-gray-400">
              <ShoppingCart size={24} />
              {cartCount > 0 && mounted && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-orange-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 dark:text-gray-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t dark:border-zinc-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/foods"
                className="block px-3 py-2 rounded-md font-medium text-gray-900 dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Menu
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md font-medium text-gray-900 dark:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="mt-4 pt-4 border-t dark:border-zinc-800">
                {session ? (
                  <div className="px-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Logged in as {session.user?.name}</p>
                    <button
                      onClick={() => signOut()}
                      className="mt-3 flex items-center gap-2 text-base font-medium text-red-600 dark:text-red-400"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md font-medium text-white bg-orange-600 text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
