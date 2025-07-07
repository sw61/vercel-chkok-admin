// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  setAuth: (token: string) => {
    localStorage.setItem('accessToken', token);
    set({ isAuthenticated: true, accessToken: token });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false, accessToken: null });
  },
}));
