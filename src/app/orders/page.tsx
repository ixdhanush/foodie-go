"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronRight, Package, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      const fetchOrders = async () => {
        try {
          const res = await fetch("/api/orders");
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [status]);

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800">
           <Package size={64} className="mx-auto text-orange-200 dark:text-orange-900 mb-6" />
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No orders found</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-8">You haven't placed any orders yet.</p>
           <Link
             href="/foods"
             className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-sm transition-all inline-block"
           >
             Start Ordering
           </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order._id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-zinc-800"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 dark:border-zinc-800 pb-4 mb-4 gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                     <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                     <p className="font-black text-xl text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.quantity} x ${(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
