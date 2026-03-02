import { create } from 'zustand';

export type TabType = 'home' | 'calendar' | 'insights' | 'settings';

export interface Cycle {
  start_date: string;
  end_date: string | null;
  length_days: number | null;
}

export interface Prediction {
  start_date: string;
  end_date: string;
  confidence_interval_days: number;
  averageCycleLength: number;
  averagePeriodLength: number;
}

export interface UserData {
  name: string;
  email: string;
  created_at: string;
}

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  cycles: Cycle[];
  setCycles: (cycles: Cycle[]) => void;
  predictions: Prediction | null;
  setPredictions: (predictions: Prediction) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  user: null,
  setUser: (user) => set({ user }),
  cycles: [],
  setCycles: (cycles) => set({ cycles }),
  predictions: null,
  setPredictions: (predictions) => set({ predictions }),
}));
