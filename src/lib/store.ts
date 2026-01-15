import { create } from 'zustand';
interface ChatStore {
  username: string | null;
  hasJoined: boolean;
  join: (name: string) => void;
  leave: () => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  username: null,
  hasJoined: false,
  join: (name) => set({ username: name, hasJoined: true }),
  leave: () => set({ username: null, hasJoined: false }),
}));