import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      profileData: null,
      isDirty: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      setProfileData: (data) => set({ profileData: data, isDirty: true }),
      clearDirty: () => set({ isDirty: false }),
      logout: () => set({ token: null, user: null, isAuthenticated: false, profileData: null, isDirty: false }),
    }),
    {
      name: 'rigtree-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        profileData: state.profileData,
      }),
    }
  )
);

export default useStore;
