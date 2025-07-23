import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      // The state will be just the theme name, e.g., 'dark' or 'light'
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
    }),
    {
      name: 'theme-storage', // The key in localStorage
      // By default, the entire state is persisted.
    }
  )
);

export default useThemeStore;
