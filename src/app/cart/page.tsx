"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-orange-100 dark:bg-orange-900/30 p-8 rounded-full text-orange-600 dark:text-orange-400"
        >
          <ShoppingBag size={64} />
        </motion.div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link
          href="/foods"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-600/30 transition-all hover:scale-105"
        >
          Browse Foods
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Shopping Cart</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          {items.map((item) => (
            <motion.div
              layout
              key={item.foodId}
              className="flex flex-col sm:flex-row items-center gap-6 py-4 border-b border-slate-100 dark:border-zinc-800 last:border-0"
            >
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-orange-600 dark:text-orange-500 font-black mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.foodId)}
                  className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 sm:p-8 border-t border-slate-100 dark:border-zinc-800">
          <div className="space-y-4 max-w-sm ml-auto">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900 dark:text-white">${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Fee</span>
              <span className="font-medium text-slate-900 dark:text-white">$5.00</span>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-zinc-700 flex justify-between">
              <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-2xl font-black text-orange-600 dark:text-orange-500">
                ${(getTotal() + 5).toFixed(2)}
              </span>
            </div>
            
            <Link
              href="/checkout"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 mt-6 block text-center"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
