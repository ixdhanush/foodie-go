import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.foodId === item.foodId);
        
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.foodId === item.foodId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (foodId) => {
        set({
          items: get().items.filter((i) => i.foodId !== foodId),
        });
      },
      updateQuantity: (foodId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.foodId === foodId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "foodiego-cart",
    }
  )
);
