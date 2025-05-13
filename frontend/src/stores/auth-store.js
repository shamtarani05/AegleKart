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
            logout: () => {
                // Clear all user data and tokens from the store
                set({ 
                    user: null, 
                    token: null, 
                    isAuthenticated: false 
                });
                
                // Remove data from localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                
                // You might also want to make an API call to invalidate the token on the server
                console.log('User logged out successfully');
            },
        }),
        {
            name: "auth-storage", // unique name
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);


export default useAuthStore;

