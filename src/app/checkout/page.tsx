"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullAddress = `${address}, ${city}, ${zip}`;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: getTotal() + 5,
          deliveryAddress: fullAddress,
          paymentMethod,
        }),
      });

      if (res.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/orders");
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-8">
            {/* Delivery Address */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                <MapPin className="text-orange-600" /> Delivery Address
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street Address</label>
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all dark:text-white outline-none"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all dark:text-white outline-none"
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ZIP Code</label>
                    <input
                      required
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 transition-all dark:text-white outline-none"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                <CreditCard className="text-orange-600" /> Payment Method
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-4 flex-1">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">Credit / Debit Card</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Visa, Mastercard, Amex (Mock)</span>
                  </div>
                  {paymentMethod === "card" && <CheckCircle2 className="text-orange-600" size={24} />}
                </label>
                
                {paymentMethod === 'card' && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     className="p-4 border border-slate-200 dark:border-zinc-700 rounded-2xl space-y-4 bg-slate-50 dark:bg-zinc-800"
                   >
                     <input type="text" placeholder="Card Number" className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all dark:text-white outline-none" />
                     <div className="flex gap-4">
                       <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all dark:text-white outline-none" />
                       <input type="text" placeholder="CVC" className="w-1/2 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all dark:text-white outline-none" />
                     </div>
                   </motion.div>
                )}

                <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-4 flex-1">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">Cash on Delivery</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Pay when your food arrives</span>
                  </div>
                  {paymentMethod === "cod" && <CheckCircle2 className="text-orange-600" size={24} />}
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-zinc-800 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 mt-4">
              {items.map((item) => (
                <div key={item.foodId} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{item.quantity}x</span>
                    <span className="text-slate-600 dark:text-slate-400 truncate w-32">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800 mb-6">
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
            </div>

             <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
