"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Script from "next/script";
import Image from "next/image";

export const dynamic = "force-dynamic";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (items.length === 0) {
      router.push("/cart");
    }
  }, [status, items, router]);

  if (status === "loading") {
     return (
        <div className="flex justify-center items-center h-[60vh]">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
     );
  }

  if (status === "unauthenticated" || items.length === 0) {
    return null;
  }

  const handleRazorpayPayment = async (fullAddress: string) => {
    try {
      const amount = getTotal() + 5;
      
      // 1. Create order on server
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR" }), // Using INR for Razorpay
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Failed to create Razorpay order");
      }

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FoodieGo",
        description: "Food Order Payment",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            // 4. Finalize order in database
            await finalizeOrder(fullAddress, "razorpay");
          } else {
            toast.error("Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#ea580c",
        },
      };

      if (typeof window === "undefined" || !window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please refresh the page.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Razorpay initialization failed");
      setLoading(false);
    }
  };

  const finalizeOrder = async (fullAddress: string, method: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: getTotal() + 5,
          deliveryAddress: fullAddress,
          paymentMethod: method,
        }),
      });

      if (res.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/orders");
      } else {
        toast.error("Failed to place order in our database");
      }
    } catch (error) {
      toast.error("Something went wrong while finalizing order");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullAddress = `${address}, ${city}, ${zip}`;

    if (paymentMethod === "card") {
      await handleRazorpayPayment(fullAddress);
    } else {
      await finalizeOrder(fullAddress, "cod");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
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
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">Online Payment (Razorpay)</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Cards, UPI, Netbanking, Wallets</span>
                  </div>
                  {paymentMethod === "card" && <CheckCircle2 className="text-orange-600" size={24} />}
                </label>
                
                {paymentMethod === 'card' && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     className="p-4 border border-slate-200 dark:border-zinc-700 rounded-2xl bg-orange-50 dark:bg-orange-900/10"
                   >
                     <p className="text-sm text-orange-700 dark:text-orange-300">
                       You will be redirected to Razorpay to complete your secure payment.
                     </p>
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
