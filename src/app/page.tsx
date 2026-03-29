import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Zap, ShieldCheck, Clock } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import { supabase } from "@/lib/supabase";

const FALLBACK_FOODS = [
  {
    _id: "1",
    name: "Spicy Beef Burger",
    description: "Double patty with extra cheese and jalapenos.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "Burgers",
    type: "non-veg" as const,
    restaurant: "Burger King",
    rating: 4.8,
  },
  {
    _id: "2",
    name: "Margherita Pizza",
    description: "Classic pizza with fresh tomatoes and mozzarella.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    category: "Pizza",
    type: "veg" as const,
    restaurant: "Domino's",
    rating: 4.5,
  },
  {
    _id: "3",
    name: "California Sushi Roll",
    description: "Fresh crab, avocado, and cucumber wrapped in rice and seaweed.",
    price: 18.5,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    category: "Sushi",
    type: "non-veg" as const,
    restaurant: "Sushi Master",
    rating: 4.9,
  },
  {
    _id: "4",
    name: "Vegan Buddha Bowl",
    description: "Quinoa, roasted sweet potatoes, avocado, and tahini dressing.",
    price: 11.0,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    category: "Healthy",
    type: "veg" as const,
    restaurant: "Green Leaf",
    rating: 4.7,
  },
];

async function getFeaturedFoods() {
  try {
    const { data: foods, error } = await supabase
      .from("foods")
      .select("*")
      .limit(4);

    if (error || !foods || foods.length === 0) {
      return FALLBACK_FOODS;
    }

    return foods.map((food) => ({
      ...food,
      _id: food.id,
      type: food.type as "veg" | "non-veg",
    }));
  } catch (err) {
    console.error("Error fetching foods:", err);
    return FALLBACK_FOODS;
  }
}

export default async function Home() {
  const featuredFoods = await getFeaturedFoods();

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative bg-orange-50 dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden mt-6">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Hero Background"
            fill
            className="object-cover opacity-10 dark:opacity-20 mix-blend-multiply"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/90 to-transparent dark:from-zinc-900/90" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              Fastest <span className="text-orange-600 dark:text-orange-500">Delivery</span> &<br />
              Easy <span className="text-orange-600 dark:text-orange-500">Pickup</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              Experience the best food from top restaurants, delivered blazing fast to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/foods"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-orange-600/30 transition-all hover:scale-105 hover:shadow-orange-600/50 flex items-center justify-center gap-2"
              >
                Order Now <ArrowRight size={20} />
              </Link>
              <div className="bg-white dark:bg-zinc-800 rounded-full flex items-center px-6 py-4 shadow-sm border border-slate-100 dark:border-zinc-700">
                <Search size={20} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search food or restaurant..."
                  className="bg-transparent border-none outline-none ml-3 w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative h-[500px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-400/20 blur-3xl rounded-full" />
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-rose-400/20 blur-3xl rounded-full" />

            <Image
              src="https://images.unsplash.com/photo-1544025162-836706037b42"
              alt="Delicious Burger"
              width={500}
              height={500}
              className="object-cover rounded-full shadow-2xl border-8 border-white dark:border-zinc-800 rotate-12 hover:rotate-0 transition-transform duration-700 mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col items-center text-center gap-4 hover:shadow-xl transition-shadow">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full text-orange-600 dark:text-orange-400">
            <Clock size={32} />
          </div>
          <h3 className="text-xl font-bold dark:text-white">Fast Delivery</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Delivery that is always on time even faster.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col items-center text-center gap-4 hover:shadow-xl transition-shadow lg:-translate-y-4">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full text-rose-600 dark:text-rose-400">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold dark:text-white">Quality Guarantee</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Best quality food for you from top restaurants.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col items-center text-center gap-4 hover:shadow-xl transition-shadow">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full text-yellow-600 dark:text-yellow-400">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold dark:text-white">Easy Ordering</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">A seamless and hassle-free ordering process.</p>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black dark:text-white">Browse <span className="text-orange-600">Categories</span></h2>
          <Link href="/foods" className="text-orange-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          {["Burgers", "Pizza", "Sushi", "Healthy", "Desserts", "Drinks"].map((cat, i) => (
            <Link
              href={`/foods?category=${cat}`}
              key={i}
              className="bg-white dark:bg-zinc-900 px-6 py-4 rounded-full font-bold shadow-sm border border-slate-100 dark:border-zinc-800 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section>
        <h2 className="text-3xl font-black mb-8 dark:text-white">Our <span className="text-orange-600">Popular</span> Dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredFoods.map((food: any) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
}
