"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const searchSuggestions = [
  "Search 'Ghee Roast Dosa'",
  "Search 'Saravana Bhavan'",
  "Search 'Ambur Star Chicken Biryani'",
  "Search 'Masala Dosa'",
  "Search 'Pizza'",
  "Search 'Burger'",
  "Search 'Sangeetha Veg Restaurant'",
  "Search 'Sushi'",
  "Search 'Filter Coffee'",
  "Search 'Adyar Ananda Bhavan'"
];

export default function HeroSearch() {
  const [currentPlaceholderIdx, setCurrentPlaceholderIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIdx((prev) => (prev + 1) % searchSuggestions.length);
    }, 3000); // Change placeholder every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/foods?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // If user presses enter without typing, search the current placeholder
      const match = searchSuggestions[currentPlaceholderIdx].match(/'([^']+)'/);
      if (match && match[1]) {
         router.push(`/foods?search=${encodeURIComponent(match[1])}`);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white dark:bg-zinc-800 rounded-full flex items-center px-6 py-4 shadow-sm border border-slate-100 dark:border-zinc-700 w-full lg:w-[400px]"
    >
      <Search size={20} className="text-slate-400 min-w-[20px]" />
      
      <div className="relative w-full h-[24px] ml-3 flex items-center overflow-hidden">
        {!searchQuery && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlaceholderIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 text-slate-400 pointer-events-none whitespace-nowrap"
              >
                {searchSuggestions[currentPlaceholderIdx]}
              </motion.div>
            </AnimatePresence>
        )}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-slate-900 dark:text-white relative z-10"
        />
      </div>
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}
