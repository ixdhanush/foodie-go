"use client";

import { useEffect, useState } from "react";
import FoodCard from "@/components/FoodCard";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function FoodsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const categories = ["All", "Burgers", "Pizza", "Sushi", "Healthy", "Desserts", "Drinks"];
  const types = ["All", "veg", "non-veg"];

  const fetchFoods = async () => {
    setLoading(true);
    try {
      let query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category && category !== "All") query.append("category", category);
      if (type && type !== "All") query.append("type", type);
      
      const res = await fetch(`/api/foods?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFoods(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => fetchFoods(), 500);
    return () => clearTimeout(timeOutId);
  }, [search, category, type]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800">
        <div className="w-full md:w-1/3 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search yummy food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-shadow dark:text-white"
          />
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="flex bg-slate-50 dark:bg-zinc-800 p-1 rounded-xl">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  type === t || (!type && t === "All")
                    ? "bg-white dark:bg-zinc-700 shadow-sm text-orange-600 dark:text-orange-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative">
             <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 px-4 py-3 pr-10 rounded-xl outline-none border-none cursor-pointer focus:ring-2 focus:ring-orange-500 font-medium font-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-zinc-900 rounded-2xl h-[360px] border border-slate-100 dark:border-zinc-800">
              <div className="h-56 bg-slate-200 dark:bg-zinc-800 rounded-t-2xl"></div>
              <div className="p-4 space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-8 bg-slate-200 dark:bg-zinc-800 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : foods.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No food found</h2>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search term.</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {foods.map((food: any) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
