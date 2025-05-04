import { create } from "zustand";
import { persist } from "zustand/middleware";



const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            isLoggedIn: () => !!set.getState().user,
            isAdmin: () => set.getState().user?.role === "admin",
            isUser: () => set.getState().user?.role === "user",
            updateuser: (user) => set((state) => ({ user: { ...state.user, ...user } })),

        }),
        {
            name: "auth-storage", // unique name
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);


export default useAuthStore;

