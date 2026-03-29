"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("foods");
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Burgers",
    type: "non-veg",
    restaurant: "",
    rating: "4.5",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any).role !== "admin") {
      router.push("/");
    } else if (status === "authenticated" && (session?.user as any).role === "admin") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foodsRes, ordersRes] = await Promise.all([
        fetch("/api/foods"),
        fetch("/api/orders")
      ]);
      
      if (foodsRes.ok) setFoods(await foodsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && formData._id ? `/api/foods/${formData._id}` : "/api/foods";
      const method = isEditing && formData._id ? "PUT" : "POST";
      
      const payload = { ...formData, price: Number(formData.price), rating: Number(formData.rating) };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Food ${isEditing ? "updated" : "added"} successfully`);
        fetchData();
        resetForm();
      } else {
        toast.error("Failed to process request");
      }
    } catch (error) {
       toast.error("Error occurred");
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/foods/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Food deleted");
        fetchData();
      }
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success("Order status updated");
        fetchData();
      }
    } catch (error) {
       toast.error("Status update failed");
    }
  };

  const editFood = (food: any) => {
    setIsEditing(true);
    setFormData({
      ...food,
      price: food.price.toString(),
      rating: food.rating.toString(),
    });
    setActiveTab("add-food");
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormData({
      _id: "",
      name: "",
      description: "",
      price: "",
      image: "",
      category: "Burgers",
      type: "non-veg",
      restaurant: "",
      rating: "4.5",
    });
    setActiveTab("foods");
  };

  if (loading || status === "loading") {
    return (
       <div className="flex justify-center items-center h-[60vh]">
         <Loader2 className="animate-spin text-orange-500" size={48} />
       </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Manage food items and orders.</p>
         </div>
         
         <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-full shadow-sm border border-slate-100 dark:border-zinc-800">
            {["foods", "orders", "add-food"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                   if(tab === "add-food") resetForm();
                   setActiveTab(tab);
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                  activeTab === tab 
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab === "add-food" ? (isEditing ? "Edit Food" : "Add Food") : tab}
              </button>
            ))}
         </div>
      </div>

      {activeTab === "foods" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
           <table className="w-full text-left font-medium">
             <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 text-sm">
               <tr>
                 <th className="px-6 py-4">Food Item</th>
                 <th className="px-6 py-4 hidden md:table-cell">Category</th>
                 <th className="px-6 py-4">Price</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
               {foods.map((food: any) => (
                 <tr key={food._id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                   <td className="px-6 py-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden relative border border-slate-100 dark:border-zinc-700 shrink-0">
                         <Image src={food.image} alt={food.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-bold">{food.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{food.restaurant}</p>
                      </div>
                   </td>
                   <td className="px-6 py-4 hidden md:table-cell text-slate-600 dark:text-slate-400">
                      {food.category}
                   </td>
                   <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">
                      ${food.price.toFixed(2)}
                   </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button onClick={() => editFood(food)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Edit2 size={18} />
                         </button>
                         <button onClick={() => handleDeleteFood(food._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </td>
                 </tr>
               ))}
               {foods.length === 0 && (
                 <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                     No foods found. Add some!
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-x-auto">
           <table className="w-full text-left font-medium whitespace-nowrap">
             <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 text-sm">
               <tr>
                 <th className="px-6 py-4">Order ID</th>
                 <th className="px-6 py-4">Customer</th>
                 <th className="px-6 py-4">Total</th>
                 <th className="px-6 py-4">Date</th>
                 <th className="px-6 py-4">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
               {orders.map((order: any) => (
                 <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                   <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">
                     #{order._id.slice(-6).toUpperCase()}
                   </td>
                   <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                     {order.user?.name || "Unknown"} <br />
                     <span className="text-xs text-slate-400 dark:text-slate-500">{order.user?.email || ""}</span>
                   </td>
                   <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">
                      ${order.totalAmount.toFixed(2)}
                   </td>
                   <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                   </td>
                   <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none cursor-pointer ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-none'
                        }`}
                      >
                         <option value="pending">Pending</option>
                         <option value="preparing">Preparing</option>
                         <option value="delivered">Delivered</option>
                         <option value="cancelled">Cancelled</option>
                      </select>
                   </td>
                 </tr>
               ))}
               {orders.length === 0 && (
                 <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                     No orders yet.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      )}

      {activeTab === "add-food" && (
         <form onSubmit={handleFoodSubmit} className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {isEditing ? "Edit Food Details" : "Add New Food"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                 <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
                 <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
               <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white resize-none" />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
               <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                 <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white">
                    {["Burgers", "Pizza", "Sushi", "Healthy", "Desserts", "Drinks"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                 <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white">
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Restaurant</label>
                 <input required type="text" value={formData.restaurant} onChange={e => setFormData({...formData, restaurant: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
                 <input required type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white" />
               </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
               <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
                 Cancel
               </button>
               <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30 flex items-center gap-2">
                 <Plus size={20} /> {isEditing ? "Save Changes" : "Create Food"}
               </button>
            </div>
         </form>
      )}
    </div>
  );
}
