import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        const existingItem = get().cart.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            cart: get().cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
            ),
          });
        } else {
          set({
            cart: [...get().cart, { ...item, quantity: item.quantity || 1 }],
          });
        }
      },
      removeFromCart: (id) =>
        set({ cart: get().cart.filter((item) => item.id !== id) }),
      clearCart: () => set({ cart: [] }),
      getTotalItems: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;