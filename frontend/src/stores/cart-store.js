import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        const existingItem = get().cart.find((i) => i.id === item.id);
        
        if (existingItem) {
          // Calculate new quantity
          const newQuantity = existingItem.quantity + (item.quantity || 1);
          
          // Check if exceeding max quantity
          if (existingItem.maxQuantity && newQuantity > existingItem.maxQuantity) {
            // Show alert instead of just logging to console
            alert(`Cannot add more items. Only ${existingItem.maxQuantity} available in stock.`);
            return false; // Return false to indicate operation wasn't successful
          }
          
          set({
            cart: get().cart.map((i) =>
              i.id === item.id ? { ...i, quantity: newQuantity } : i
            ),
          });
          return true; // Return true to indicate successful operation
        } else {
          // For new items, respect any quantity/maxQuantity passed
          const quantity = item.quantity || 1;
          const maxQuantity = item.maxQuantity || Infinity;
          
          if (quantity > maxQuantity) {
            alert(`Cannot add ${quantity} items. Only ${maxQuantity} available in stock.`);
            return false;
          }
          
          // Add with bounded quantity
          set({
            cart: [...get().cart, { 
              ...item, 
              quantity: Math.min(quantity, maxQuantity) 
            }],
          });
          return true;
        }
      },
      // Check if adding quantity would exceed the maximum
      canAddQuantity: (id, quantityToAdd = 1) => {
        const item = get().cart.find(i => i.id === id);
        if (!item) return true;
        
        if (item.maxQuantity) {
          return (item.quantity + quantityToAdd) <= item.maxQuantity;
        }
        return true;
      },
      // Get current quantity in cart for an item
      getItemQuantity: (id) => {
        const item = get().cart.find(i => i.id === id);
        return item ? item.quantity : 0;
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