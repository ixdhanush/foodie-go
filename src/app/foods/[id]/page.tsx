"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, ArrowLeft, Minus, Plus, ShoppingCart, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function FoodDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { items, addItem, updateQuantity } = useCartStore();

  const cartItem = items.find((i) => i.foodId === id);
  const currentQuantityInCart = cartItem?.quantity || 0;

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await fetch(`/api/foods/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFood(data);
        } else {
          toast.error("Food not found");
          router.push("/foods");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFood();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!food) return;
    
    // Instead of passing updated quantity, just pass the item 
    // Wait, addItem adds +1 if existing, but here we might want to specify quantity
    // Actually our store addItem just increments by 1. 
    // Let's modify the way we add: If it's already there, use updateQuantity instead.
    
    if (cartItem) {
      updateQuantity(food._id, currentQuantityInCart + quantity);
    } else {
      // Simulate adding 'quantity' times
      for (let i = 0; i < quantity; i++) {
        addItem({
          foodId: food._id,
          name: food.name,
          price: food.price,
          quantity: 1,
          image: food.image,
        });
      }
    }
    
    toast.success(`Added ${quantity} ${food.name} to cart`);
    setQuantity(1); // Reset
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
         <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!food) return null;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link href="/foods" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium mb-8 group transition-colors">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-zinc-900 p-6 sm:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-zinc-800">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[300px] sm:h-[400px] w-full rounded-3xl overflow-hidden shadow-inner bg-slate-100 dark:bg-zinc-800"
        >
          <Image src={food.image} alt={food.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
             <span className={food.type === "veg" ? "text-green-500" : "text-red-500"}>●</span>
             <span className="text-gray-900 dark:text-gray-100 uppercase tracking-wider">{food.type}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-6"
        >
           <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                 <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                   {food.name}
                 </h1>
                 <div className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-xl flex items-center gap-1 text-orange-600 dark:text-orange-400 shrink-0 shadow-sm border border-orange-200 dark:border-orange-800/50">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold text-sm">{food.rating || "4.5"}</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium pb-4 border-b border-slate-100 dark:border-zinc-800">
                 <MapPin size={18} className="text-orange-500 shrink-0" />
                 <span>From <strong className="text-slate-700 dark:text-slate-300">{food.restaurant}</strong></span>
              </div>
           </div>

           <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Description</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                {food.description}
              </p>
           </div>
           
           <div className="flex flex-wrap gap-4 py-2">
              <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                Category: {food.category}
              </span>
           </div>

           <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 mt-auto">
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-black text-orange-600 dark:text-orange-500">
                  ${food.price.toFixed(2)}
                </span>
                
                <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-2xl p-1.5 border border-slate-200 dark:border-zinc-700 shadow-inner">
                   <button 
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 shadow-sm hover:text-slate-900 dark:hover:text-white transition-colors"
                   >
                     <Minus size={20} />
                   </button>
                   <span className="w-14 text-center font-black text-xl text-slate-900 dark:text-white">
                     {quantity}
                   </span>
                   <button 
                     onClick={() => setQuantity(quantity + 1)}
                     className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 shadow-sm hover:text-slate-900 dark:hover:text-white transition-colors"
                   >
                     <Plus size={20} />
                   </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart size={24} /> Add to Cart - ${(food.price * quantity).toFixed(2)}
              </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
