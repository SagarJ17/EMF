import { create } from "zustand";

interface CMSState {
  settings: Record<string, string>;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  getSetting: (key: string, fallback: string) => string;
}

export const useCMSStore = create<CMSState>((set, get) => ({
  settings: {},
  loading: true,
  fetchSettings: async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${url}/settings`);
      const data = await res.json();
      set({ settings: data || {}, loading: false });
    } catch (e) {
      console.error("CMS Load Failed", e);
      set({ loading: false });
    }
  },
  getSetting: (key: string, fallback: string) => {
    const { settings } = get();
    return settings[key] || fallback;
  }
}));
