import { create } from 'zustand';
import type { User } from '@shared/types';
interface ChatStore {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  setAuth: (user: User, token: string) => void;
  setInitialized: () => void;
  logout: () => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  user: JSON.parse(localStorage.getItem('luma_user') || 'null'),
  token: localStorage.getItem('luma_token'),
  isInitialized: false,
  setAuth: (user, token) => {
    localStorage.setItem('luma_user', JSON.stringify(user));
    localStorage.setItem('luma_token', token);
    set({ user, token });
  },
  setInitialized: () => set({ isInitialized: true }),
  logout: () => {
    localStorage.removeItem('luma_user');
    localStorage.removeItem('luma_token');
    set({ user: null, token: null });
  },
}));