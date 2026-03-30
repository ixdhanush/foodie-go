
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);


const southIndianFoods = [
  {
    name: "Ghee Roast Dosa",
    description: "Crispy, golden-brown dosa roasted with pure ghee, served with three types of chutneys and flavorful sambar.",
    price: 120,
    image: "/images/foods/ghee_roast_dosa.png",
    category: "South Indian",
    type: "veg",
    restaurant: "Saravana Bhavan",
    rating: 4.8
  },
  {
    name: "Medu Vada (2 Pcs)",
    description: "Deep-fried lentil donuts with a crispy exterior and soft fluffy interior, infused with peppercorns and curry leaves.",
    price: 80,
    image: "/images/foods/medu_vada.png",
    category: "South Indian",
    type: "veg",
    restaurant: "Sangeetha Veg Restaurant",
    rating: 4.7
  },
  {
    name: "Masala Dosa",
    description: "Traditional South Indian crepe stuffed with a spicy potato mash, served with coconut chutney and sambar.",
    price: 110,
    image: "/images/foods/masala_dosa.png",
    category: "South Indian",
    type: "veg",
    restaurant: "Adyar Ananda Bhavan (A2B)",
    rating: 4.6
  },
  {
    name: "South Indian Grand Thali",
    description: "A complete meal featuring rice, sambar, rasam, kootu, poriyal, curd, pickle, appalam, and a sweet payasam.",
    price: 250,
    image: "/images/foods/south_indian_thali.png",
    category: "South Indian",
    type: "veg",
    restaurant: "Saravana Bhavan",
    rating: 4.9
  },
  {
    name: "Ambur Star Chicken Biryani",
    description: "Seeraga Samba rice biryani with succulent chicken pieces, slow-cooked in traditional Ambur style with spices.",
    price: 280,
    image: "/images/foods/chicken_biryani.png",
    category: "Main Course",
    type: "non-veg",
    restaurant: "Anjappar Chettinad Restaurant",
    rating: 4.7
  },
  {
    name: "Filter Coffee",
    description: "Authentic South Indian decoction coffee frothed with hot milk in a traditional brass davara set.",
    price: 45,
    image: "/images/foods/filter_coffee.png",
    category: "Beverages",
    type: "veg",
    restaurant: "Saravana Bhavan",
    rating: 4.9
  },
  {
    name: "Idli Sambar (3 Pcs)",
    description: "Soft, fluffy steamed rice cakes served with a generous serving of ghee and spicy sambar.",
    price: 70,
    image: "/images/foods/idli_sambar.png",
    category: "South Indian",
    type: "veg",
    restaurant: "Sangeetha Veg Restaurant",
    rating: 4.5
  },
  {
    name: "Chettinad Pepper Chicken",
    description: "A spicy, aromatic chicken dish prepared with freshly ground black pepper and South Indian spices.",
    price: 220,
    image: "https://images.unsplash.com/photo-1589187151032-573a91317445",
    category: "Main Course",
    type: "non-veg",
    restaurant: "Anjappar Chettinad Restaurant",
    rating: 4.8
  }
];

async function seed() {
  console.log("Cleaning up existing foods...");
  await supabase.from('foods').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  console.log("Seeding fresh food data...");
  const { data, error } = await supabase
    .from('foods')
    .insert(southIndianFoods);

  if (error) {
    console.error("Error seeding foods:", error);
  } else {
    console.log(`Successfully seeded ${southIndianFoods.length} dishes!`);
  }
}

seed();
