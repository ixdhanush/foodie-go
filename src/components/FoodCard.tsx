"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FoodCardProps {
  food: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    type: "veg" | "non-veg";
    restaurant: string;
    rating: number;
  };
}

export default function FoodCard({ food }: FoodCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      foodId: food._id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image,
    });
    toast.success(`Added ${food.name} to cart`);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/foods/${food._id}`}>
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
            alt={food.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <span className={food.type === "veg" ? "text-green-500" : "text-red-500"}>
              ●
            </span>
            <span className="text-gray-900 dark:text-gray-100 uppercase tracking-wider">{food.type}</span>
          </div>
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 text-orange-500 shadow-sm">
            <Star size={14} fill="currentColor" /> {food.rating || "4.5"}
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-orange-500 transition-colors">
                {food.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 flex items-center gap-1">
                {food.restaurant}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3 mb-4">
            <span className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md font-medium">
              {food.category}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-black text-gray-900 dark:text-gray-100">
              ${food.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl transition-colors hidden sm:flex items-center gap-2 shadow-sm font-medium"
            >
              <Plus size={18} /> Add
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl transition-colors sm:hidden shadow-sm flex items-center justify-center h-10 w-10"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
